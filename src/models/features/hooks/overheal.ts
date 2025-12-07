import { DebugService, Event, Method, Model } from "set-piece";
import { FeatureModel } from "../";
import { AbortEvent } from "../../../utils/events/abort";

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
> extends FeatureModel<
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
                isEnabled: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public run() {
        if (!this.isActived) return;
        // toRun
        const event = new AbortEvent({});
        this.event.toRun(event);
        const isValid = event.detail.isValid;
        if (!isValid) return false;
        // run
        this.doRun();
        // onRun
        const name = this.state.name;
        const desc = this.state.desc;
        DebugService.log(`${name} run: ${desc}`);
        this.event.onRun(new Event({}));
    }

    protected abstract doRun(): void;
}