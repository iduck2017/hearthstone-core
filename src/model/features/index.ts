import { Model } from "set-piece";
import { RoleModel } from "../role";
import { BuffModel } from "./buff";
import { CardModel } from "../card";
import { PlayerModel } from "../player";
import { GameModel } from "../game";
import { BoardModel } from "../player/board";

export namespace FeatureModel {
    export type State = {
        name: string;
        desc: string;
        isSilence: boolean;
    }
    export type Event = {
        toSilence: { isAbort?: boolean };
        onSilence: {};
    };
    export type Child = {};
    export type Refer = {};
}

export abstract class FeatureModel<
    E extends Partial<FeatureModel.Event> & Model.Event = {},
    S extends Partial<FeatureModel.State> & Model.State = {},
    C extends Partial<FeatureModel.Child> & Model.Child = {},
    R extends Partial<FeatureModel.Refer> & Model.Refer = {}
> extends Model<
    E & FeatureModel.Event,
    S & FeatureModel.State,
    C & FeatureModel.Child,
    R & FeatureModel.Refer
> {
    public get route() {
        const route = super.route;
        const role: RoleModel | undefined = route.path.find(item => item instanceof RoleModel);
        const card: CardModel | undefined = route.path.find(item => item instanceof CardModel);
        return { 
            ...route, 
            role, 
            card,
            game: route.path.find(item => item instanceof GameModel),
            board: route.path.find(item => item instanceof BoardModel),
            player: route.path.find(item => item instanceof PlayerModel)
        }
    }

    constructor(props: FeatureModel['props'] & {
        uuid: string | undefined;
        state: S & Pick<FeatureModel.State, 'name' | 'desc'>;
        child: C,
        refer: R,
    }) {
        super({
            uuid: props.uuid,
            state: { 
                isSilence: false,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }

    public silence() {
        const signal = this.event.toSilence({});
        if (signal.isAbort) return;
        this.draft.state.isSilence = true;
        this.disable();
        this.event.onSilence({});
        return true;
    }

    protected abstract disable(): void;
}