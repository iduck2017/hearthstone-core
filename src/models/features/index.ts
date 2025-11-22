import { Event, EventUtil, Model, StateUtil, TranxUtil } from "set-piece";
import { AbortEvent, GameModel, PlayerModel } from "../..";
import { CardModel } from "../entities/cards";
import { BoardModel, CollectionModel, DeckModel, GraveyardModel, HandModel } from "../..";

export namespace FeatureModel {
    export type E = {
        toActive: AbortEvent;
        onActive: Event;
        onDeactive: Event;
    };
    export type S = {
        name: string;
        desc: string;
        isEnabled: boolean;
    }
    export type C = {};
    export type R = {};
}

export abstract class FeatureModel<
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
            child: { ...props.child },
            refer: { ...props.refer }
        })
    }

    @EventUtil.if()
    @StateUtil.if()
    private check() {
        return this.isActived;
    }

    public enable() {
        if (this.origin.state.isEnabled) return false;

        // toActive
        const event = new AbortEvent({});
        this.event.toActive(event);
        const isValid = event.detail.isValid;
        if (!isValid) return false;
        // execute
        this.doEnable();
        // after
        this.event.onActive(new Event({}));
    }

    @TranxUtil.span()
    protected doEnable() {
        this.origin.state.isEnabled = true;
        this.reload();
    }

    public disable() {
        if (!this.origin.state.isEnabled) return false;
        this.doDisable();
        this.event.onDeactive(new Event({}));
    }

    @TranxUtil.span()
    protected doDisable() {
        this.origin.state.isEnabled = false;
        this.reload();
    }

}
