import { FeatureModel } from "../features";

export namespace FrozenModel {
    export type Event = {
        onActive: {};
        onDeactive: {};
    };
    export type State = {};
    export type Child = {};
    export type Refer = {};
}

export class FrozenModel extends FeatureModel<
    FrozenModel.Event,
    FrozenModel.State,
    FrozenModel.Child,
    FrozenModel.Refer
> {
    constructor(props: FrozenModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Frozen',
                desc: 'Frozen charactoers lose their next attack.',
                status: 1,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public active(): boolean {
        if (this.state.status) return false;
        this.draft.state.status = 1;
        this.event.onActive({});
        return true;
    }

    public deactive(): boolean {
        const role = this.route.role;
        if (!role) return false;
        const action = role.child.action;
        if (action.state.current <= 0) return false;
        this.disable();
        this.event.onDeactive({});
        return true;
    }
}