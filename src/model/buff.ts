import { Model, StateUtil } from "set-piece";
import { RoleModel } from "./role";
import { EffectModel } from "./effect";
import { DeepReadonly } from "utility-types";

export namespace BuffModel {
    export type State = {
        modAttack: number;
        modHealth: number;
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
    constructor(props: BuffModel['props'] & {
        state: Pick<BuffModel.State, 'modAttack' | 'modHealth'>
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

    public get route(): Model['route'] & Readonly<Partial<{
        role: RoleModel;
    }>> {
        const parent = super.route.parent;
        const effect = parent instanceof EffectModel ? parent : undefined;
        const role = effect?.route.role;
        return {
            ...super.route,
            role,
        }
    }

    public disable() {
        this.draft.state.isEnable = false;
        this.reload();
    }

    @StateUtil.on(self => self.route.role?.proxy.decor)
    protected onRoleCheck(that: RoleModel, state: DeepReadonly<RoleModel.State>): DeepReadonly<RoleModel.State> {
        if (!this.state.isEnable) return state;
        return {
            ...state,
            modAttack: state.modAttack + this.state.modAttack,
            modHealth: state.modHealth + this.state.modHealth,
        }
    }
}