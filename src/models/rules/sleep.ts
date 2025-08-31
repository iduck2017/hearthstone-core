import { Event, Model } from "set-piece";
import { FeatureStatus } from "../features";

export namespace SleepProps {
    export type E = {
        onActive: Event;
        onDeactive: Event;
    };
    export type S = {
        status: FeatureStatus;
    }
    export type C = {};
    export type R = {}
}

export class SleepModel extends Model<
    SleepProps.E,
    SleepProps.S,
    SleepProps.C,
    SleepProps.R
> {
    constructor(props: SleepModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                status: FeatureStatus.ACTIVE,
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }

    public active() {
        this.draft.state.status = FeatureStatus.ACTIVE;
        this.event.onActive(new Event({}));
    }

    public deactive(): void {
        this.draft.state.status = FeatureStatus.INACTIVE;
        this.event.onDeactive(new Event({}));
    }
}