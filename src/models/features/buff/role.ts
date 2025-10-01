import { Decor, Method, Model, Props, StateUtil, StoreUtil } from "set-piece";
import { FeatureModel, FeatureProps } from "..";
import { RoleAttackDecor, RoleAttackModel, RoleAttackProps } from "../../rules/attack/role";
import { HealthDecor, HealthModel, HealthProps } from "../../rules/health";
import { RoleFeatureModel } from "../role";

export namespace RoleBuffProps {
    export type S = {
        readonly offset: Readonly<[number, number]>;
    };
    export type E = {};
    export type C = {};
    export type R = {};
}

export abstract class RoleBuffModel<
    E extends Partial<RoleBuffProps.E & FeatureProps.E> & Props.E = {},
    S extends Partial<RoleBuffProps.S & FeatureProps.S> & Props.S = {},
    C extends Partial<RoleBuffProps.C & FeatureProps.C> & Props.C = {},
    R extends Partial<RoleBuffProps.R & FeatureProps.R> & Props.R = {}
> extends RoleFeatureModel<
    E & RoleBuffProps.E,
    S & RoleBuffProps.S,
    C & RoleBuffProps.C,
    R & RoleBuffProps.R
> {
    constructor(loader: Method<RoleBuffModel['props'] & {
        uuid: string | undefined;
        state: S & RoleBuffProps.S & Omit<FeatureProps.S, 'isActive'>,
        child: C,
        refer: R,
    }, []>) {
        super(() => {
            const props = loader();
            return {
                uuid: props.uuid,
                state: {
                    isActive: true,
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: {},
            }
        });
    }

    @StateUtil.on(self => self.route.role?.proxy.child.attack.decor)
    protected onAttackCompute(that: RoleAttackModel, decor: RoleAttackDecor) {
        if (!this.state.isActive) return;
        decor.add(this.state.offset[0]);
    }

    @StateUtil.on(self => self.route.role?.proxy.child.health.decor)
    protected onHealthCompute(that: HealthModel, decor: HealthDecor) {
        if (!this.state.isActive) return;
        decor.add(this.state.offset[1]);
    }

    public override() {
        this.draft.state.isActive = false;
        this.reload();
    }
}