import { Event, Loader, StoreUtil } from "set-piece";
import { FeatureModel } from "../features";

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
                    isActive: true,
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
            }
        })
    }
}