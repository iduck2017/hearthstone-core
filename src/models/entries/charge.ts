import { Decor, Event, Loader, StateUtil, StoreUtil, TranxUtil } from "set-piece";
import { FeatureModel, FeatureStatus } from "../features";
import { SleepModel, SleepProps } from "../rules/sleep";

export namespace ChargeProps {
    export type E = {
        onActive: Event
    }
    export type S = {}
    export type C = {}
    export type R = {}
}

@StoreUtil.is('charge')
export class ChargeModel extends FeatureModel<
    ChargeProps.E,
    ChargeProps.S,
    ChargeProps.C,
    ChargeProps.R
> {
    constructor(loader?: Loader<ChargeModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Charge',
                    desc: 'Can attack immediately.',
                    status: FeatureStatus.ACTIVE,
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
            }
        })
    }

    @StateUtil.on(self => self.route.role?.proxy.child.sleep.decor)
    protected onCheck(that: SleepModel, state: Decor<SleepProps.S>) {
        if (!this.state.status) return;
        state.current.status = FeatureStatus.INACTIVE;
    }
}