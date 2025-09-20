import { Event, Loader, Method, Model, StoreUtil, TranxUtil } from "set-piece";


export namespace ManaProps {
    export type E = {
        onUse: Event<{ value: number }>;
    };
    export type S = {
        origin: number;
        current: number;
        limit: number;
    }
    export type C = {};
    export type R = {};
}

@StoreUtil.is('mana')
export class ManaModel extends Model<
    ManaProps.E,
    ManaProps.S,
    ManaProps.C,
    ManaProps.R
> {
    constructor(loader?: Loader<ManaModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    origin: 0,
                    current: props.state?.origin ?? 0,
                    limit: 10,
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer }, 
                route: {},
            }
        })
    }

    @TranxUtil.span()
    public reset() {
        if (this.draft.state.origin < this.draft.state.limit) {
            this.draft.state.origin += 1;
        }
        this.draft.state.current = this.draft.state.origin;
    }

    public use(value: number) {
        if (value > this.draft.state.current) value= this.draft.state.current;
        this.draft.state.current -= value;
        this.event.onUse(new Event({ value }));
    }
}