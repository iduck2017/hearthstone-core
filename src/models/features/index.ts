import { Event, EventPlugin, Model, StatePlugin, TranxService } from "set-piece";
import { AbortEvent, BuffModel, GameModel, HeroModel, MinionCardModel, PlayerModel, SpellCardModel, WeaponCardModel } from "../..";
import { CardModel } from "../entities/cards";
import { BoardModel, CollectionModel, DeckModel, GraveyardModel, HandModel } from "../..";

export namespace FeatureModel {
    export type E = {
        toEnable: AbortEvent;
        onEnable: Event;
        toDisable: Event;
        onDisable: Event;
    };
    export type S = {
        name: string;
        desc: string;
        isEnabled: boolean;
    }
    export type C = {
        buffs: BuffModel[];
    };
    export type R = {};
}

export class FeatureModel<
    E extends Partial<FeatureModel.E> & Model.E = {},
    S extends Partial<FeatureModel.S> & Model.S = {},
    C extends Partial<FeatureModel.C> & Model.C = {},
    R extends Partial<FeatureModel.R> & Model.R = {},
> extends Model<
    E & FeatureModel.E,
    S & FeatureModel.S,
    C & FeatureModel.C,
    R & FeatureModel.R
> {
    public get route() {
        const result = super.route;
        const card: CardModel | undefined = result.items.find(item => item instanceof CardModel);
        const hero: HeroModel | undefined = result.items.find(item => item instanceof HeroModel);
        const minion: MinionCardModel | undefined = result.items.find(item => item instanceof MinionCardModel);
        const weapon: WeaponCardModel | undefined = result.items.find(item => item instanceof WeaponCardModel);
        const spell: SpellCardModel | undefined = result.items.find(item => item instanceof SpellCardModel);
        const role = minion ?? hero;
        return {
            ...result,
            card,
            board: result.items.find(item => item instanceof BoardModel),
            hand: result.items.find(item => item instanceof HandModel),
            deck: result.items.find(item => item instanceof DeckModel),
            graveyard: result.items.find(item => item instanceof GraveyardModel),
            collection: result.items.find(item => item instanceof CollectionModel),
            player: result.items.find(item => item instanceof PlayerModel),
            game: result.items.find(item => item instanceof GameModel),
            hero,
            role,
            weapon,
            spell,
        }
    }

    public get chunk() {
        if (!this.state.isEnabled) return undefined;
        return { desc: this.state.desc }
    }

    public get state() {
        const result = super.state;
        return {
            ...result,
            isActived: this.isActived,
        }
    }

    protected get isActived(): boolean {
        return super.state.isEnabled;
    }

    constructor(props: FeatureModel['props'] & {
        uuid: string | undefined;
        state: S & FeatureModel.S;
        child: C,
        refer: R,
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                buffs: props.child.buffs ?? [],
                ...props.child,
            },
            refer: { ...props.refer }
        })
    }

    @EventPlugin.if()
    @StatePlugin.if()
    private check() {
        return this.isActived;
    }

    public enable() {
        const isValid = this.toEnable()
        if (!isValid) return;
        // execute
        this.doEnable();
        // after
        this.event.onEnable(new Event({}));
    }

    @TranxService.span()
    protected doEnable() {
        this.origin.state.isEnabled = true;
        this.reload();
    }

    protected toEnable(): boolean {
        // already enabled
        const state = this.origin.state;
        if (state.isEnabled) return false;
        // abort event
        const event = new AbortEvent({})
        this.event.toEnable(event);
        const isValid = event.detail.isValid;
        if (!isValid) return false;
        return true;
    }

    protected onEnable() {

    }

    public disable() {
        if (!this.origin.state.isEnabled) return false;
        this.doDisable();
        this.child.buffs.forEach(buff => buff.disable());
        this.event.onDisable(new Event({}));
    }

    @TranxService.span()
    protected doDisable() {
        this.origin.state.isEnabled = false;
        this.reload();
    }
}
