import { Model, StateUtil, TranxUtil } from "set-piece";
import { FeatureModel } from ".";
import { CardModel } from "../card";
import { RoleModel } from "../role";
import { DeepReadonly } from "utility-types";
import { RootModel } from "../root";

export namespace EffectModel {
    export type State = Partial<FeatureModel.State> & {
        modAttack: number;
        modHealth: number;
        isEnable: boolean;
    }
    export type Event = Partial<FeatureModel.Event> & {};
    export type Child = Partial<FeatureModel.Child> & {};
    export type Refer = Partial<FeatureModel.Refer> & {};
}

export class EffectModel<
    E extends Partial<EffectModel.Event> & Model.Event = {},
    S extends Partial<EffectModel.State> & Model.State = {},
    C extends Partial<EffectModel.Child> & Model.Child = {},
    R extends Partial<EffectModel.Refer> & Model.Refer = {}
> extends FeatureModel<
    E & EffectModel.Event,
    S & EffectModel.State,
    C & EffectModel.Child,
    R & EffectModel.Refer
> {
    constructor(props: EffectModel['props'] & {
        uuid: string | undefined;
        state: S & Pick<FeatureModel.State, 'desc' | 'name'> & Pick<EffectModel.State, 'modAttack' | 'modHealth' | 'isEnable'>
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
        })
    }

    public get route(): Readonly<Partial<{
        role: RoleModel;
        card: CardModel;
        root: RootModel;
    }>>{
        const route = super.route;
        const root = route.root instanceof RootModel ? route.root : undefined;
        const role = route.parent instanceof RoleModel ? route.parent : undefined;
        const card = role?.route.parent instanceof CardModel ? role.route.parent : undefined;
        return {
            ...route,
            root,
            card,
        }
    }

    @StateUtil.on(self => self.route.role?.proxy.decor)
    private onRoleCheck(that: RoleModel, state: DeepReadonly<RoleModel.State>): DeepReadonly<RoleModel.State> {
        if (!this.state.isEnable) return state;
        return {
            ...state,
            modAttack: state.modAttack + this.state.modAttack,
            modHealth: state.modHealth + this.state.modHealth,
        }
    }

    @TranxUtil.span()
    public reset() {
        this.draft.state.isEnable = false;
        this.reload();
    }
}