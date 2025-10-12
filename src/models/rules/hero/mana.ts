import { Event, Method, Model, TemplUtil, TranxUtil } from "set-piece";

export namespace ManaModel {
    export type E = {
        onUse: Event<{ value: number; reason?: Model }>;
    };
    export type S = {
        origin: number;
        current: number;
        maximum: number;
    }
    export type C = {};
    export type R = {};
}

@TemplUtil.is('mana')
export class ManaModel extends Model<
    ManaModel.E,
    ManaModel.S,
    ManaModel.C,
    ManaModel.R
> {
    constructor(props?: ManaModel['props']) {
        super({
            uuid: props?.uuid,
            state: {
                origin: 0,
                current: props?.state?.origin ?? 0,
                maximum: 10,
                ...props?.state,
            },
            child: { ...props?.child },
            refer: { ...props?.refer }, 
        })
    }

    @TranxUtil.span()
    public reset() {
        if (this.origin.state.origin < this.origin.state.maximum) {
            this.origin.state.origin += 1;
        }
        this.origin.state.current = this.origin.state.origin;
    }

    public use(value: number, reason?: Model) {
        if (value > this.origin.state.current) value= this.origin.state.current;
        this.origin.state.current -= value;
        this.event.onUse(new Event({ value, reason }));
    }
}