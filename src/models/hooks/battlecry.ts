import { Event, Method, Model, Props } from "set-piece";
import { SelectEvent } from "../../utils/select";
import { FeatureModel, FeatureProps } from "../features";
import { CardFeatureModel } from "../features/card";

export namespace BattlecryProps {
    export type E = {
        toRun: Event;
        onRun: Event;
    };
    export type S = {};
    export type C = {};
    export type R = {};
}

export abstract class BattlecryModel<
    T extends Model[] = Model[],
    E extends Partial<BattlecryProps.E> & Props.E = {},
    S extends Partial<BattlecryProps.S> & Props.S = {},
    C extends Partial<BattlecryProps.C> & Props.C = {},
    R extends Partial<BattlecryProps.R> & Props.R = {}
> extends CardFeatureModel<
    E & BattlecryProps.E, 
    S & BattlecryProps.S, 
    C & BattlecryProps.C, 
    R & BattlecryProps.R
> {
    constructor(loader: Method<BattlecryModel['props'] & {
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

    public async run(...params: T) {
        if (!this.state.isActive) return;
        const signal = this.event.toRun(new Event({}));
        if (signal.isCancel) return;
        await this.doRun(...params);
        this.event.onRun(new Event({}));
    }   

    protected abstract doRun(...params: T): Promise<void>;

    public abstract toRun(): { [K in keyof T]: SelectEvent<T[K]> } | undefined;
}