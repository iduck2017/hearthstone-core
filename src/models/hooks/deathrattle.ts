import { Event, Method, Model } from "set-piece";
import { AbortEvent } from "../../types/event";
import { FeatureModel } from "../rules/feature";

export namespace DeathrattleModel {
    export type E = {
        toRun: AbortEvent;
        onRun: {};
    };
    export type S = {};
    export type C = {};
    export type R = {};
    export type P = {};
}

export abstract class DeathrattleModel<
    E extends Partial<DeathrattleModel.E> & Model.E = {},
    S extends Partial<DeathrattleModel.S> & Model.S = {},
    C extends Partial<DeathrattleModel.C> & Model.C = {},
    R extends Partial<DeathrattleModel.R> & Model.R = {},
> extends FeatureModel<
    E & DeathrattleModel.E, 
    S & DeathrattleModel.S, 
    C & DeathrattleModel.C, 
    R & DeathrattleModel.R
> {

    constructor(props: DeathrattleModel['props'] & {
        uuid: string | undefined;
        state: S & Pick<FeatureModel.S, 'desc' | 'name'>;
        child: C;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: {
                isActive: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public run() {
        if (!this.state.isActive) return;
        
        const event = new AbortEvent({});
        this.event.toRun(event);
        if (event.detail.isAbort) return;

        this.doRun();
        this.event.onRun(new Event({}));
    }

    protected abstract doRun(): void;
}