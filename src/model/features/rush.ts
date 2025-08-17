import { FeatureModel } from ".";

export namespace RushModel {
    export type Event = {
        onGet: {};
    };
    export type State = {
        isActive: boolean;
        isCurrent: boolean;
    }
    export type Child = {};
    export type Refer = {};
}

export class RushModel extends FeatureModel<
    RushModel.Event,
    RushModel.State,
    RushModel.Child,
    RushModel.Refer
> {
    constructor(props: RushModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Rush',
                desc: 'Can attack minions immediately.',
                isActive: false,
                isCurrent: false,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    protected disable(): void {
        this.draft.state.isActive = false;
        this.draft.state.isCurrent = false;
    }
}