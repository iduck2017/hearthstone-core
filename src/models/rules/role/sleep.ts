import { Event, Model } from "set-piece";

export namespace SleepModel {
    export type E = {
        onActive: Event;
        onDeactive: Event;
    };
    export type S = {
        isActive: boolean;
    }
    export type C = {};
    export type R = {}
}

export class SleepModel extends Model<
    SleepModel.E,
    SleepModel.S,
    SleepModel.C,
    SleepModel.R
> {

    constructor(props?: SleepModel['props']) {
        super({
            uuid: props?.uuid,
            state: {
                isActive: true,
                ...props?.state
            },
            child: { ...props?.child },
            refer: { ...props?.refer },
        })
    }

    public active() {
        this.origin.state.isActive = true;
        this.event.onActive(new Event({}));
    }

    public deactive() {
        this.origin.state.isActive = false;
        this.event.onDeactive(new Event({}));
    }
}