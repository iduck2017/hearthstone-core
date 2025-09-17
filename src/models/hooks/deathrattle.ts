import { Event, Method, Model, Props } from "set-piece";
import { FeatureModel, FeatureProps } from "../features";
import { CardFeatureModel } from "../features/card";

export namespace DeathrattleProps {
    export type E = {
        toRun: Event;
        onRun: Event;
    };
    export type S = {};
    export type C = {};
    export type R = {};
}

export abstract class DeathrattleModel<
    E extends Partial<DeathrattleProps.E> & Props.E = {},
    S extends Partial<DeathrattleProps.S> & Props.S = {},
    C extends Partial<DeathrattleProps.C> & Props.C = {},
    R extends Partial<DeathrattleProps.R> & Props.R = {}
> extends CardFeatureModel<
    E & DeathrattleProps.E, 
    S & DeathrattleProps.S, 
    C & DeathrattleProps.C, 
    R & DeathrattleProps.R
> {

    constructor(loader: Method<DeathrattleModel['props'] & {
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
        });
    }

    public run() {
        if (!this.state.isActive) return;
        
        const signal = new Event()
        this.event.toRun(new Event());
        if (signal.isCancel) return;

        this.doRun();
        this.event.onRun(new Event());
    }

    protected abstract doRun(): Promise<void>;
}