import { Model } from "set-piece";
import { FeatureModel } from "../features";

export namespace SleepModel {
    export type Event = {
        onActive: {};
        onDeactive: {};
    };
    export type State = {
        isActive: boolean;
    }
    export type Child = {};
    export type Refer = {}
}

export class SleepModel extends Model<
    SleepModel.Event,
    SleepModel.State,
    SleepModel.Child,
    SleepModel.Refer
> {
    constructor(props: SleepModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                isActive: true,
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }

    public active() {
        this.draft.state.isActive = true;
        this.event.onActive({});
    }

    public deactive(): void {
        this.draft.state.isActive = false;
        this.event.onDeactive({});
    }
}