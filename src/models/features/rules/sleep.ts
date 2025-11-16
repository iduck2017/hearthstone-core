import { Event, Model } from "set-piece";

export namespace SleepModel {
    export type E = {
        onActive: Event;
        onDisable: Event;
    };
    export type S = {
        actived: boolean;
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
                actived: true,
                ...props?.state
            },
            child: { ...props?.child },
            refer: { ...props?.refer },
        })
    }

    public active() {
        this.origin.state.actived = true;
        this.event.onActive(new Event({}));
    }

    public disable() {
        this.origin.state.actived = false;
        this.event.onDisable(new Event({}));
    }
}