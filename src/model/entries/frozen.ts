import { FeatureModel } from "../features";

export namespace FrozenModel {
    export type Event = {
        onActive: {};
        onDeactive: {};
    };
    export type State = {
        isActive: boolean;
    };
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
                isActive: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    protected doDisable(): void {}

    public active(): boolean {
        if (this.state.isActive) return false;
        this.draft.state.isActive = true;
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