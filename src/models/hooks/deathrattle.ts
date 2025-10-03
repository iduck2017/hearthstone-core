import { Event, Method, Model, Props } from "set-piece";
import { FeatureModel, FeatureProps } from "../features";

export namespace DeathrattleProps {
    export type E = {
        toRun: Event;
        onRun: Event;
    };
    export type S = {};
    export type C = {};
    export type R = {};
    export type P = {};
}

export abstract class DeathrattleModel<
    E extends Partial<DeathrattleProps.E> & Props.E = {},
    S extends Partial<DeathrattleProps.S> & Props.S = {},
    C extends Partial<DeathrattleProps.C> & Props.C = {},
    R extends Partial<DeathrattleProps.R> & Props.R = {},
    P extends Partial<DeathrattleProps.P> & Props.P = {}
> extends FeatureModel<
    E & DeathrattleProps.E, 
    S & DeathrattleProps.S, 
    C & DeathrattleProps.C, 
    R & DeathrattleProps.R,
    P & DeathrattleProps.P
> {

    constructor(loader: Method<DeathrattleModel['props'] & {
        uuid: string | undefined;
        state: S & Pick<FeatureProps.S, 'desc' | 'name'>;
        child: C;
        refer: R;
        route: P;
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
                route: { ...props.route },
            }
        });
    }

    public run() {
        if (!this.state.isActive) return;
        
        const event = new Event({})
        this.event.toRun(new Event({}));
        if (event.isAbort) return;

        this.doRun();
        this.event.onRun(new Event({}));
    }

    protected abstract doRun(): Promise<void>;
}