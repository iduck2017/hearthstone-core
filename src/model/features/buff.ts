import { Model, StateUtil } from "set-piece";
import { RoleModel } from "../role";
import { FeatureModel } from ".";
import { PlayerModel } from "../player";
import { GameModel } from "../game";
import { BoardModel } from "../player/board";

export namespace BuffModel {
    export type State = FeatureModel.State & {
        modAttack: number;
        modHealth: number;
        isActive: boolean;
    };
    export type Event = FeatureModel.Event & {};
    export type Child = FeatureModel.Child & {};
    export type Refer = FeatureModel.Refer & {};
}

export abstract class BuffModel<
    E extends Partial<BuffModel.Event> & Model.Event = {},
    S extends Partial<BuffModel.State> & Model.State = {},
    C extends Partial<BuffModel.Child> & Model.Child = {},
    R extends Partial<BuffModel.Refer> & Model.Refer = {}
> extends FeatureModel<
    E & BuffModel.Event,
    S & BuffModel.State,
    C & BuffModel.Child,
    R & BuffModel.Refer
> {
    public get route() {
        const route = super.route;
        const role: RoleModel | undefined = route.path.find(item => item instanceof RoleModel);
        return { 
            ...route,
            role,
            game: route.path.find(item => item instanceof GameModel),
            board: route.path.find(item => item instanceof BoardModel),
            player: route.path.find(item => item instanceof PlayerModel),
        }
    }

    constructor(props: BuffModel['props'] & {
        uuid: string | undefined;
        state: S & 
            Pick<BuffModel.State, 'modAttack' | 'modHealth'> & 
            Pick<FeatureModel.State, 'name' | 'desc'>,
        child: C,
        refer: R,
    }) {
        super({
            uuid: props.uuid,
            state: {
                isActive: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public disable() {
        this.draft.state.isActive = false;
        this.reload();
    }

    @StateUtil.on(self => self.route.role?.proxy.decor)
    protected onStateCheck(that: RoleModel, state: RoleModel.State) {
        if (!this.state.isActive) return state;
        return {
            ...state,
            modAttack: state.modAttack + this.state.modAttack,
            modHealth: state.modHealth + this.state.modHealth,
        }
    }
}