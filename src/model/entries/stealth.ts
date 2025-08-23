import { FeatureModel } from "../features";

export namespace StealthModel {
    export type Event = {
        onActive: {};
        onDeactive: {};
    };
    export type State = {};
    export type Child = {};
    export type Refer = {};
}

export class StealthModel extends FeatureModel<
    StealthModel.Event,
    StealthModel.State,
    StealthModel.Child,
    StealthModel.Refer
> {
    constructor(props: StealthModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Stealth',
                desc: '',
                isActive: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public active() {
        if (this.state.isActive) return false; 
        this.draft.state.isActive = true;
        this.event.onActive({});
        return true;
    }

    public deactive() {
        this.disable();
        this.event.onDeactive({});
    }

    public doDisable() {}
}