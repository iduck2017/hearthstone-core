import { Event, Loader, Method, Model, Props } from "set-piece";
import { FeatureModel, FeatureProps, ROLE_ROUTE, RoleRoute } from "../..";

export namespace OverhealProps {
    export type E = {
        toRun: Event;
        onRun: Event;
    };
    export type S = {};
    export type C = {};
    export type R = {};
    export type P = RoleRoute;
}

export abstract class OverhealModel<
    E extends Partial<OverhealProps.E> & Props.E = {},
    S extends Partial<OverhealProps.S> & Props.S = {},
    C extends Partial<OverhealProps.C> & Props.C = {},
    R extends Partial<OverhealProps.R> & Props.R = {},
> extends FeatureModel<
    E & OverhealProps.E,
    S & OverhealProps.S,
    C & OverhealProps.C,
    R & OverhealProps.R,
    OverhealProps.P
> {
    constructor(loader: Method<OverhealModel['props'] & {
        uuid: string | undefined;
        state: S & Pick<FeatureProps.S, 'desc' | 'name'>;
        child: C;
        refer: R;
    }, []>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    isActive: true,
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: ROLE_ROUTE,
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

    protected abstract doRun(): void;
}