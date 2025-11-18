import { FeatureModel } from "..";
import { DebugUtil, Event, Model } from "set-piece";
import { Selector } from "../../../types/selector";
import { CallerModel } from "../../common/caller";
import { CalleeModel } from "../../common/callee";

export namespace EffectModel {
    export type E = {
        onRun: Event<{}>;
    };
    export type S = {
        power: number;
        multiselect: boolean;
        async: boolean;
    };
    export type C = {};
    export type R = {
        callers: CallerModel<[EffectModel]>[]
    };
}

export abstract class EffectModel<
    T extends Model = Model,
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
                actived: true,
                async: false,
                multiselect: false,
                ...props.state 
            },
            child: { ...props.child },
            refer: { 
                callers: [],
                ...props.refer 
            },
        })
    }

    public start(...params: Array<T | undefined>) {
        if (!this.state.actived) return;

        const name = this.state.name;
        const desc = this.state.desc;
        DebugUtil.log(`${name} run (${desc})`);
        this.run(params);
        if (!this.state.async) this.end();
    }

    protected end() {
        this.event.onRun(new Event({}));
        this.resolve(this);
    }

    protected abstract run(params: Array<T | undefined>): void;

    public abstract prepare(prev: Array<T | undefined>): Selector<T> | undefined;
}

