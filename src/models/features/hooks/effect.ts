import { FeatureModel } from "..";
import { DebugUtil, Event, Model } from "set-piece";
import { Selector } from "../../../types/selector";
import { SpellCardModel } from "../../entities/cards/spell";
import { SpellPerformModel } from "../perform/spell";
import { PerformModel } from "../perform";

export namespace EffectModel {
    export type E = {
        onRun: Event<{}>;
    };
    export type S = {
        power: number;
        multiselect: boolean;
        pending: boolean;
        async: boolean;
    };
    export type C = {};
    export type R = {
        caller?: PerformModel 
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
                pending: false,
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


    public run(...params: Array<T | undefined>) {
        if (!this.toRun()) return;
        this.doRun(...params);
        if (!this.state.async) this.onRun();
    }


    protected toRun(): boolean {
        if (!this.status) return false;

        const name = this.state.name;
        const desc = this.state.desc;
        DebugUtil.log(`${name} run: ${desc}`);
        return true;
    }

    protected onRun() {
        this.origin.state.pending = false;
        const caller = this.origin.refer.caller;
        this.origin.refer.caller = undefined;
        if (caller) caller.doPlay();
        this.event.onRun(new Event({}));
    }

    protected abstract doRun(...params: Array<T | undefined>): void;

    public abstract prepare(...params: Array<T | undefined>): Selector<T> | undefined;
}

