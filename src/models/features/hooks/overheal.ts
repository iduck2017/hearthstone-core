import { DebugUtil, Event, Method, Model } from "set-piece";
import { FeatureModel } from "../../..";
import { AbortEvent } from "../../../types/events/abort";
import { CardFeatureModel } from "../card";

export namespace OverhealModel {
    export type E = {
        toRun: AbortEvent;
        onRun: Event;
    };
    export type S = {};
    export type C = {};
    export type R = {};
}

export abstract class OverhealModel<
    E extends Partial<OverhealModel.E> & Model.E = {},
    S extends Partial<OverhealModel.S> & Model.S = {},
    C extends Partial<OverhealModel.C> & Model.C = {},
    R extends Partial<OverhealModel.R> & Model.R = {},
> extends CardFeatureModel<
    E & OverhealModel.E,
    S & OverhealModel.S,
    C & OverhealModel.C,
    R & OverhealModel.R
> {
    constructor(props: OverhealModel['props'] & {
        uuid: string | undefined;
        state: S & Pick<FeatureModel.S, 'desc' | 'name'>;
        child: C;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: {
                isActived: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public run() {
        if (!this.status) return;
        // toRun
        const event = new AbortEvent({});
        this.event.toRun(event);
        const isValid = event.detail.isValid;
        if (!isValid) return false;
        // run
        this.run();
        // onRun
        const name = this.state.name;
        const desc = this.state.desc;
        DebugUtil.log(`${name} run: ${desc}`);
        this.event.onRun(new Event({}));
    }

    protected abstract doRun(): void;
}