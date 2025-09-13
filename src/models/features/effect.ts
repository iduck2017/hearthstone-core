import { Loader, Method, Model, Props } from "set-piece";
import { SelectEvent } from "../../utils/select";
import { FeatureModel, FeatureProps } from "../features";
import { CardFeatureModel } from "./card";

export namespace EffectProps {
    export type E = {};
    export type S = {};
    export type C = {};
    export type R = {};
}

export abstract class EffectModel<
    T extends Model[] = Model[],
    E extends Partial<EffectProps.E & FeatureProps.E> & Props.E = {},
    S extends Partial<EffectProps.S & FeatureProps.S> & Props.S = {},
    C extends Partial<EffectProps.C & FeatureProps.C> & Props.C = {},
    R extends Partial<EffectProps.R & FeatureProps.R> & Props.R = {},
> extends CardFeatureModel<
    E & EffectProps.E, 
    S & EffectProps.S,
    C & EffectProps.C, 
    R & EffectProps.R
> {
    constructor(loader: Method<EffectModel['props'] & {
        uuid: string | undefined,
        state: S & Pick<FeatureProps.S, 'desc' | 'name'>,
        child: C,
        refer: R,
    }, []>) {
        super(() => {
            const props = loader();
            return {
                uuid: props.uuid,
                state: {
                    isActive: true,
                    ...props.state 
                },
                child: { ...props.child },
                refer: { ...props.refer },
            }
        })
    }

    public async run(...params: T) {
        if (!this.state.isActive) return;
        await this.doRun(...params);
    }

    protected abstract doRun(...params: T): Promise<void>;

    public abstract toRun(): { [K in keyof T]: SelectEvent<T[K]> } | undefined;
}