import { FeatureModel } from "../features";

export namespace ElusiveModel {
    export type Event = {
        onActive: {};
        onDeactive: {};
    };
    export type State = {}
    export type Child = {};
    export type Refer = {};
}

export class ElusiveModel extends FeatureModel<
    ElusiveModel.Event,
    ElusiveModel.State,
    ElusiveModel.Child,
    ElusiveModel.Refer
> {
    constructor(props: ElusiveModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Elusive',
                desc: 'Can\'t be targeted by spells or Hero Powers.',
                status: 1,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }

    public active(): boolean {
        if (this.state.status) return false;
        this.draft.state.status = 1;
        this.event.onActive({});
        return true;
    }
}