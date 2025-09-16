import { Event, Loader, Model } from "set-piece";

export namespace ArmorProps {
    export type E = {}
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
                route: {},
            }
        });
    }

    public gain(value: number) {
        this.draft.state.origin += value;
    }
}