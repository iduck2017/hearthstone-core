import { FeatureModel } from "..";
import { DebugUtil, Model } from "set-piece";
import { Selector } from "../../rules/selector";

export namespace EffectModel {
    export type E = {};
    export type S = {
        power: number;
    };
    export type C = {};
    export type R = {};
}

export abstract class EffectModel<
    T extends any[] = any[],
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
    protected get status(): boolean {
        return true
    }

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

        DebugUtil.log(`${this.state.name} run (${this.state.desc})`);
        await this.doRun(...params);
    }


    protected abstract doRun(...params: T): Promise<void>;

    public abstract toRun(): { [K in keyof T]: Selector<T[K]> } | undefined;
}