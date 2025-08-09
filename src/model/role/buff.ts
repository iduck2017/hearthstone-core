import { Model, StateUtil } from "set-piece";
import { RoleModel } from ".";
import { DeepReadonly } from "utility-types";
import { AttackModel } from "./attack";
import { HealthModel } from "./health";
import { RoleFeatureModel } from "./feature";

export namespace BuffModel {
    export type State = {
        attack: number;
        health: number;
        isEnable: boolean;
    };
    export type Event = {};
    export type Child = {};
    export type Refer = {};
}

export class BuffModel extends Model<
    BuffModel.Event,
    BuffModel.State,
    BuffModel.Child,
    BuffModel.Refer
> {
    public get route() {
        const path = super.route.path;
        const role = path.find(item => item instanceof RoleModel);
        const feature = path.find(item => item instanceof RoleFeatureModel);
        return { ...super.route, role, feature }
    }

    constructor(props: BuffModel['props'] & {
        state: Pick<BuffModel.State, 'attack' | 'health'>
    }) {
        super({
            uuid: props.uuid,
            state: { 
                isEnable: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public disable() {
        this.draft.state.isEnable = false;
        this.reload();
    }

    @StateUtil.on(self => self.route.role?.proxy.child.attack.decor)
    protected onAttackCheck(that: AttackModel, state: DeepReadonly<AttackModel['state']>): DeepReadonly<AttackModel['state']> {
        if (!this.state.isEnable) return state;
        return {
            ...state,
            buff: state.buff + this.state.attack
        }
    }

    @StateUtil.on(self => self.route.role?.proxy.child.health.decor)
    protected onHealthCheck(that: HealthModel, state: DeepReadonly<HealthModel.State>): DeepReadonly<HealthModel.State> {
        if (!this.state.isEnable) return state;
        return {
            ...state,
            buff: state.buff + this.state.health
        }
    }
}