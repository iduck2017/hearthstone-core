import { Decor, Model, Props, StateUtil } from "set-piece";
import { RoleModel } from "../role";
import { FeatureModel, FeatureProps, FeatureStatus } from ".";
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
    constructor(props: BuffModel['props'] & {
        uuid: string | undefined;
        state: S & Pick<BuffProps.S, 'offsetAttack' | 'offsetHealth'> & Pick<FeatureProps.S, 'name' | 'desc'>,
        child: C,
        refer: R,
    }) {
        super({
            uuid: props.uuid,
            state: {
                status: FeatureStatus.ACTIVE,
                isOverride: false,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @StateUtil.on(self => self.route.role?.proxy.child.attack.decor)
    protected onAttackCheck(that: AttackModel, state: Decor<AttackProps.S>) {
        if (!this.state.status) return;
        const self: BuffModel = this;
        state.current.offset += self.state.offsetAttack;
    }

    @StateUtil.on(self => self.route.role?.proxy.child.health.decor)
    protected onHealthCheck(that: HealthModel, state: Decor<HealthProps.S>) {
        if (!this.state.status) return;
        const self: BuffModel = this;
        state.current.offset += self.state.offsetHealth;
    }

    public override() {
        this.draft.state.status = FeatureStatus.INACTIVE;
        this.reload();
    }
}