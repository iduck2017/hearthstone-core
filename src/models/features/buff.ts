import { Decor, Method, Model, Props, StateUtil, StoreUtil } from "set-piece";
import { FeatureModel, FeatureProps } from ".";
import { AttackModel, AttackProps } from "../rules/attack";
import { HealthModel, HealthProps } from "../rules/health";

export namespace BuffProps {
    export type S = {
        offsetAttack: number;
        offsetHealth: number;
    };
    export type E = {};
    export type C = {};
    export type R = {};
}

export abstract class BuffModel<
    E extends Partial<BuffProps.E & FeatureProps.E> & Props.E = {},
    S extends Partial<BuffProps.S & FeatureProps.S> & Props.S = {},
    C extends Partial<BuffProps.C & FeatureProps.C> & Props.C = {},
    R extends Partial<BuffProps.R & FeatureProps.R> & Props.R = {}
> extends FeatureModel<
    E & BuffProps.E,
    S & BuffProps.S,
    C & BuffProps.C,
    R & BuffProps.R
> {
    constructor(loader: Method<BuffModel['props'] & {
        uuid: string | undefined;
        state: S & BuffProps.S & Omit<FeatureProps.S, 'isActive'>,
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
    protected onAttackCheck(that: AttackModel, decor: Decor<AttackProps.S>) {
        if (!this.state.isActive) return;
        const self: BuffModel = this;
        decor.current.offset += self.state.offsetAttack;
    }

    @StateUtil.on(self => self.route.role?.proxy.child.health.decor)
    protected onHealthCheck(that: HealthModel, decor: Decor<HealthProps.S>) {
        if (!this.state.isActive) return;
        const self: BuffModel = this;
        decor.current.offset += self.state.offsetHealth;
    }

    public override() {
        this.draft.state.isActive = false;
        this.reload();
    }
}