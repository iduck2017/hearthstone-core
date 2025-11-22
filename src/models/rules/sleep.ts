import { Event, Model } from "set-piece";

export namespace SleepModel {
    export type E = {
        onActive: Event;
        onDisable: Event;
    };
    export type S = {
        isActived: boolean;
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
                isActived: true,
                ...props?.state
            },
            child: { ...props?.child },
            refer: { ...props?.refer },
        })
    }

    public active() {
        this.origin.state.isActived = true;
        this.event.onActive(new Event({}));
    }

    public disable() {
        this.origin.state.isActived = false;
        this.event.onDisable(new Event({}));
    }
}