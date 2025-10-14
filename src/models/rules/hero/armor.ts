import { Event, Model } from "set-piece";

export namespace ArmorModel {
    export type E = {
        onGet: Event<{ value: number }>;
        onConsume: Event<{ value: number }>;
    }
    export type S = {
        current: number;
    }
    export type C = {}
    export type R = {}
}

export class ArmorModel extends Model<
    ArmorModel.E,
    ArmorModel.S,
    ArmorModel.C,
    ArmorModel.R
> {
    public get chunk() {
        return {
            state: this.state,
        }
    }

    constructor(props?: ArmorModel['props']) {
        super({
            uuid: props?.uuid,
            state: {    
                current: 0,
                ...props?.state,
            },
            child: { ...props?.child },
            refer: { ...props?.refer },
        });
    }

    public get(value: number) {
        const result = this.add(value);
        this.event.onGet(new Event({ value: result }));
        return result;
    }

    protected add(value: number) { 
        if (value <= 0) return 0;
        this.origin.state.current += value; 
        return value;
    }

    protected del(value: number) { 
        if (value <= 0) return 0;
        value = Math.min(value, this.origin.state.current);
        this.origin.state.current -= value;
        return value;
    }

    public consume(value: number) {
        const result = this.del(value);
        this.event.onConsume(new Event({ value: result }));
        return result;
    }
}