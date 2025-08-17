import { FeatureModel } from ".";

export namespace ChargeModel {
    export type Event = {
        onGet: {};
    };
    export type State = {
        isActive: boolean;
    }
    export type Child = {};
    export type Refer = {};
}

export class ChargeModel extends FeatureModel<
    ChargeModel.Event,
    ChargeModel.State,
    ChargeModel.Child,
    ChargeModel.Refer
> {
    constructor(props: ChargeModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Charge',
                desc: 'Can attack immediately.',
                isActive: false,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }

    protected disable(): void {
        this.draft.state.isActive = false;
    }
}