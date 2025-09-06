import { Event, Loader, Method, Model } from "set-piece";

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
    constructor(loader?: Loader<ArmorModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {    
                    origin: 0,
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
            }
        });
    }

    public gain(value: number) {
        this.draft.state.origin += value;
        this.event.onGain(new Event({ value }));
    }
}