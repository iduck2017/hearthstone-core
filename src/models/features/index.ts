import { Event, Method, Model, Props, TranxUtil } from "set-piece";
import { BoardModel, CardModel, DeckModel, GraveyardModel, HandModel, MinionCardModel, PlayerModel, RoleModel } from "../..";
import { GameModel } from "../..";
import { DamageModel } from "../..";
import { CharacterModel } from "../..";
import { RestoreModel } from "../actions/restore";

export namespace FeatureProps {
    export type E = {
        toSilence: Event;
        onSilence: Event;
    };
    export type S = {
        name: string;
        desc: string;
        isActive: boolean;
    }
    export type C = {
        damage: DamageModel;
        restore: RestoreModel;
    };
    export type R = {};
}

export abstract class FeatureModel<
    E extends Partial<FeatureProps.E> & Props.E = {},
    S extends Partial<FeatureProps.S> & Props.S = {},
    C extends Partial<FeatureProps.C> & Props.C = {},
    R extends Partial<FeatureProps.R> & Props.R = {}
> extends Model<
    E & FeatureProps.E,
    S & FeatureProps.S,
    C & FeatureProps.C,
    R & FeatureProps.R
> {
    public get route() {
        const route = super.route;
        const minion: MinionCardModel | undefined = route.order.find(item => item instanceof MinionCardModel);
        const card: CardModel | undefined = route.order.find(item => item instanceof CardModel);
        const character: CharacterModel | undefined = route.order.find(item => item instanceof CharacterModel);
        const entity = card ?? character;
        return {
            ...route,
            minion,
            card,
            character,
            entity,
            role: route.order.find(item => item instanceof RoleModel),
            board: route.order.find(item => item instanceof BoardModel),
            hand: route.order.find(item => item instanceof HandModel),
            deck: route.order.find(item => item instanceof DeckModel),
            graveyard: route.order.find(item => item instanceof GraveyardModel),
            game: route.order.find(item => item instanceof GameModel),
            player: route.order.find(item => item instanceof PlayerModel)
        }
    }

    constructor(loader: Method<FeatureModel['props'] & {
        uuid: string | undefined;
        state: S & FeatureProps.S;
        child: C,
        refer: R,
    }, []>) {
        super(() => {
            const props = loader?.();
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { 
                    damage: props.child?.damage ?? new DamageModel(),
                    restore: props.child?.restore ?? new RestoreModel(),
                    ...props.child
                },
                refer: { ...props.refer },
            }
        })
    }


    public silence(): boolean {
        const signal = this.event.toSilence(new Event({}));
        if (signal.isCancel) return false;
        this.disable();
        this.event.onSilence(new Event({}));
        return true;
    }

    @TranxUtil.span()
    public disable() {
        this.draft.state.isActive = false;
        this.reload();
    }
}
