import { FeatureModel } from "..";
import { DebugUtil, Event, Model } from "set-piece";
import { Selector } from "../../rules/selector";
import { CallerModel } from "../../rules/caller";
import { CalleeModel } from "../../rules/callee";

export namespace EffectModel {
    export type E = {
        onRun: Event<{}>;
    };
    export type S = {
        power: number;
        isAsync: boolean;
    };
    export type C = {};
    export type R = {
        callers: CallerModel<[EffectModel]>[]
    };
}

export abstract class EffectModel<
    T extends any[] = any[],
    E extends Partial<EffectModel.E> & Partial<FeatureModel.E> & Model.E = {},
    S extends Partial<EffectModel.S> & Partial<FeatureModel.S> & Model.S = {},
    C extends Partial<EffectModel.C> & Partial<FeatureModel.C> & Model.C = {},
    R extends Partial<EffectModel.R> & Partial<FeatureModel.R> & Model.R = {},
> extends FeatureModel<
    E & EffectModel.E, 
    S & EffectModel.S,
    C & EffectModel.C, 
    R & EffectModel.R
>  implements CalleeModel<[EffectModel]>  {
    protected get status(): boolean {
        return true
    }
    
    public readonly promise = CalleeModel.prototype.promise.bind(this);
    public readonly resolve = CalleeModel.prototype.resolve.bind(this);

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
                isAsync: false,
                ...props.state 
            },
            child: { ...props.child },
            refer: { 
                callers: [],
                ...props.refer 
            },
        })
    }

    public run(...params: T) {
        if (!this.state.isActive) return;

        DebugUtil.log(`${this.state.name} run (${this.state.desc})`);
        this.doRun(...params);
        if (!this.state.isAsync) this.onRun();
    }

    protected onRun() {
        this.event.onRun(new Event({}));
        this.resolve(this);
    }

    protected abstract doRun(...params: T): void;

    public abstract toRun(): { [K in keyof T]: Selector<T[K]> } | undefined;
}