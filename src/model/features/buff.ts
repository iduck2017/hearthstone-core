import { Model, StateUtil, TranxUtil } from "set-piece";
import { RoleModel } from "../role";
import { FeatureModel } from ".";
import { PlayerModel } from "../player";
import { GameModel } from "../game";
import { BoardModel } from "../player/board";
import { AttackModel } from "../role/attack";
import { HealthModel } from "../role/health";

export namespace BuffModel {
    export type State = Partial<FeatureModel.State> & {
        isActive: boolean;
        isOverride: boolean;
        attack: number;
        health: number;
    };
    export type Event = Partial<FeatureModel.Event> & {};
    export type Child = Partial<FeatureModel.Child> & {};
    export type Refer = Partial<FeatureModel.Refer> & {};
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
            Pick<BuffModel.State, 'attack' | 'health'> & 
            Pick<FeatureModel.State, 'name' | 'desc'>,
        child: C,
        refer: R,
    }) {
        super({
            uuid: props.uuid,
            state: {
                isActive: true,
                isOverride: false,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public override() {
        this.draft.state.isOverride = true;
        this.reload();
    }

    @TranxUtil.span()
    protected doDisable() {
        this.draft.state.isActive = false;
        this.reload();
    }

    @StateUtil.on(self => self.route.role?.proxy.child.attack.decor)
    protected onAttackCheck(that: AttackModel, state: AttackModel.State) {
        if (!this.state.isActive) return state;
        if (this.state.isOverride) return state;
        return {
            ...state,
            offset: state.offset + this.state.attack,
        }
    }

    @StateUtil.on(self => self.route.role?.proxy.child.health.decor)
    protected onHealthCheck(that: HealthModel, state: HealthModel.State) {
        if (!this.state.isActive) return state;
        if (this.state.isOverride) return state;
        return {
            ...state,
            offset: state.offset + this.state.health,
        }
    }
}