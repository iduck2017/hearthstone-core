import { Event, Loader, Model } from "set-piece";

export namespace ArmorProps {
    export type E = {
        onGet: Event<{ value: number }>;
        onUse: Event<{ value: number }>;
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
                route: {},
            }
        });
    }

    public get(value: number) {
        const result = this.add(value);
        this.event.onGet(new Event({ value: result }));
        return result;
    }

    protected add(value: number) { 
        if (value <= 0) return 0;
        this.draft.state.origin += value; 
        return value;
    }

    protected del(value: number) { 
        if (value <= 0) return 0;
        value = Math.min(value, this.draft.state.origin);
        this.draft.state.origin -= value;
        return value;
    }

    public use(value: number) {
        const result = this.del(value);
        this.event.onUse(new Event({ value: result }));
        return result;
    }
}