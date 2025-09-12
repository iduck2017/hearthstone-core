import { Decor, Method, Model, Props, StateUtil, StoreUtil } from "set-piece";
import { FeatureModel, FeatureProps } from "..";
import { RoleAttackModel, RoleAttackProps } from "../../rules/attack/role";
import { HealthModel, HealthProps } from "../../rules/health";

export namespace RoleBuffProps {
    export type S = {
        offsetAttack: number;
        offsetHealth: number;
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
> extends FeatureModel<
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
            }
        });
    }

    @StateUtil.on(self => self.route.role?.proxy.child.attack.decor)
    protected onAttackCheck(that: RoleAttackModel, decor: Decor<RoleAttackProps.S>) {
        if (!this.state.isActive) return;
        const self: RoleBuffModel = this;
        decor.current.offset += self.state.offsetAttack;
    }

    @StateUtil.on(self => self.route.role?.proxy.child.health.decor)
    protected onHealthCheck(that: HealthModel, decor: Decor<HealthProps.S>) {
        if (!this.state.isActive) return;
        const self: RoleBuffModel = this;
        decor.current.offset += self.state.offsetHealth;
    }

    public override() {
        this.draft.state.isActive = false;
        this.reload();
    }
}