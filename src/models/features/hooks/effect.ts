import { FeatureModel } from "..";
import { DebugUtil, Event, Model } from "set-piece";
import { Selector } from "../../../types/selector";
import { AbortEvent } from "../../../types/events/abort";

export namespace EffectModel {
    export type E = {
        toRun: AbortEvent
        onRun: Event<{}>;
    };
    export type S = {
        power: number;

        isMultiselect: boolean;
        isPending: boolean;
        isAsync: boolean;
    };
    export type C = {};
    export type R = {};
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
                isPending: false,
                power: 0,
                isActived: true,
                isAsync: false,
                isMultiselect: false,
                ...props.state 
            },
            child: { ...props.child },
            refer: { 
                callers: [],
                ...props.refer 
            },
        })
    }


    public async run(params: Array<T | undefined>): Promise<void> {
        // toRun
        if (!this.state.isPending) {
            if (!this.isValid) return;
            const event = new AbortEvent({});
            this.event.toRun(event);
            const isValid = event.detail.isValid;
            if (!isValid) return;

            this.origin.state.isPending = true;
        }
        
        // run
        await this.doRun(params);
        this.origin.state.isPending = false;

        // onRun
        const name = this.state.name;
        const desc = this.state.desc;
        DebugUtil.log(`${name} run: ${desc}`);
        this.event.onRun(new Event({}));
    }


    protected abstract doRun(params: Array<T | undefined>): Promise<void>;

    public abstract prepare(params: Array<T | undefined>): Selector<T> | undefined;
}

