import { Model, StoreUtil, TranxUtil } from "set-piece";

export namespace ManaModel {
    export type Event = {
        onConsume: { value: number }
    };
    export type State = {
        origin: number;
        current: number;
        limit: number;
    }
    export type Child = {};
    export type Refer = {};
}

@StoreUtil.is('mana')
export class ManaModel extends Model<
    ManaModel.Event,
    ManaModel.State,
    ManaModel.Child,
    ManaModel.Refer
> {
    constructor(props: ManaModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                origin: 0,
                current: props.state?.origin ?? 0,
                limit: 10,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer }, 
        })
    }

    @TranxUtil.span()
    public reset() {
        if (this.draft.state.origin < this.draft.state.limit) {
            this.draft.state.origin += 1;
        }
        this.draft.state.current = this.draft.state.origin;
    }

    public consume(value: number) {
        if (value > this.draft.state.current) value= this.draft.state.current;
        this.draft.state.current -= value;
        this.event.onConsume({ value });
    }
}