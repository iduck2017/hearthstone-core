import { FeatureModel } from "./feature";
import { SelectEvent, SelectUtil } from "../../utils/select";
import { Model } from "set-piece";

export namespace EffectModel {
    export type E = {};
    export type S = {
        power: number;
    };
    export type C = {};
    export type R = {};
}

export abstract class EffectModel<
    T extends Model[] = Model[],
    E extends Partial<FeatureModel.E> & Model.E = {},
    S extends Partial<FeatureModel.S> & Model.S = {},
    C extends Partial<FeatureModel.C> & Model.C = {},
    R extends Partial<FeatureModel.R> & Model.R = {},
> extends FeatureModel<
    E & EffectModel.E, 
    S & EffectModel.S,
    C & EffectModel.C, 
    R & EffectModel.R
> {

    constructor(props: EffectModel['props'] & {
        uuid: string | undefined,
        state: S & Pick<FeatureModel.S, 'desc' | 'name'>,
        child: C,
        refer: R,
    }) {
        super({
            uuid: props.uuid,
            state: {
                power: 0,
                isActive: true,
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }

    public async run(...params: T) {
        if (!this.state.isActive) return;
        await this.doRun(...params);
    }

    protected abstract doRun(...params: T): Promise<void>;

    public abstract toRun(): { [K in keyof T]: SelectEvent<T[K]> } | undefined;
}