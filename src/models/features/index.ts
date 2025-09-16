import { Event, Method, Model, Props, TranxUtil } from "set-piece";
import { GameModel, PlayerModel } from "../..";

export namespace FeatureProps {
    export type E = {
        onSilence: Event;
    };
    export type S = {
        name: string;
        desc: string;
        isActive: boolean;
    }
    export type C = {};
    export type R = {};
    export type P = {
        game: GameModel;
        player: PlayerModel;
    };
}

export abstract class FeatureModel<
    E extends Partial<FeatureProps.E> & Props.E = {},
    S extends Partial<FeatureProps.S> & Props.S = {},
    C extends Partial<FeatureProps.C> & Props.C = {},
    R extends Partial<FeatureProps.R> & Props.R = {},
    P extends Partial<FeatureProps.P> & Props.P = {},
> extends Model<
    E & FeatureProps.E,
    S & FeatureProps.S,
    C & FeatureProps.C,
    R & FeatureProps.R,
    P & FeatureProps.P
> {
    constructor(loader: Method<FeatureModel['props'] & {
        uuid: string | undefined;
        state: S & FeatureProps.S;
        child: C,
        refer: R,
        route: P,
    }, []>) {
        super(() => {
            const props = loader?.();
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { ...props.child },
                refer: { ...props.refer },
                route: {
                    game: GameModel.prototype,
                    player: PlayerModel.prototype,
                    ...props.route,
                },
            }
        })
    }

    public silence(): boolean {
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
