import { Event, Model } from "set-piece";

export namespace ArmorProps {
    export type E = {
        onGain: Event<{ value: number }>;
    }
    export type S = {
        origin: number;
    }
    export type C = {}
    export type R = {}
}

export class ArmorModel extends Model<
    ArmorProps.E,
    ArmorProps.S,
    ArmorProps.C,
    ArmorProps.R
> {
    constructor(props: ArmorModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                origin: props.state?.origin ?? 0,
            },
            child: {},
            refer: {},
        });
    }

    public gain(value: number) {
        this.draft.state.origin += value;
        this.event.onGain(new Event({ value }));
    }
}