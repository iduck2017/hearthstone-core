import { Event, Method, Model, Props } from "set-piece";
import { MinionCardModel } from "../cards/minion";
import { FeatureModel, FeatureProps } from "../features";

export namespace EndTurnHookProps {
    export type E = {
        onRun: Event;
        toRun: Event;
    };
    export type S = {};
    export type C = {};
    export type R = {};
}

export abstract class EndTurnHookModel<
    E extends Partial<EndTurnHookProps.E> & Props.E = {},
    S extends Partial<EndTurnHookProps.S> & Props.S = {},
    C extends Partial<EndTurnHookProps.C> & Props.C = {},
    R extends Partial<EndTurnHookProps.R> & Props.R = {}
> extends FeatureModel<
    E & EndTurnHookProps.E,
    S & EndTurnHookProps.S,
    C & EndTurnHookProps.C,
    R & EndTurnHookProps.R
> {
    constructor(loader: Method<EndTurnHookModel['props'] & {
        uuid: string | undefined;
        state: S & Pick<FeatureProps.S, 'desc' | 'name'>;
        child: C;
        refer: R;
    }, []>) {
        super(() => {
            const props = loader?.();
            return {
                uuid: props.uuid,
                state: {
                    isActive: true,
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: {},
            }
        })
    }

    public run() {
        if (!this.state.isActive) return;
        this.event.toRun(new Event({}));
        this.doRun();
        this.event.onRun(new Event({}));
    }

    protected abstract doRun(): void;
}