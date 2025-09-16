import { Event, Method, Model, Props } from "set-piece";
import { EndTurnHookModel } from "./end-turn";
import { FeatureModel, FeatureProps } from "../features";
import { CardFeatureModel } from "../features/card";

export namespace StartTurnHookProps {
    export type E = {
        onRun: void;
    };
    export type S = {};
    export type C = {};
    export type R = {};
}

export abstract class StartTurnHookModel<
    E extends Partial<StartTurnHookProps.E> & Props.E = {},
    S extends Partial<StartTurnHookProps.S> & Props.S = {},
    C extends Partial<StartTurnHookProps.C> & Props.C = {},
    R extends Partial<StartTurnHookProps.R> & Props.R = {}
> extends CardFeatureModel<
    E & StartTurnHookProps.E,
    S & StartTurnHookProps.S,
    C & StartTurnHookProps.C,
    R & StartTurnHookProps.R
> {
    constructor(loader: Method<StartTurnHookModel['props'] & {
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
    
    public async run() {
        if (!this.state.isActive) return;
        await this.doRun();
        this.event.onRun(undefined);
    }

    protected abstract doRun(): Promise<void>;
}