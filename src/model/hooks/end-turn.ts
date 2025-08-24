import { Model } from "set-piece";
import { CardModel } from "../card";
import { FeatureModel } from "../feature";
import { AnchorModel } from "../rules/anchor";

export namespace EndTurnHookModel {
    export type Event = {
        onRun: {};
        toRun: {};
    };
    export type State = {};
    export type Child = {};
    export type Refer = {};
}

export abstract class EndTurnHookModel<
    E extends Partial<EndTurnHookModel.Event> & Model.Event = {},
    S extends Partial<EndTurnHookModel.State> & Model.State = {},
    C extends Partial<EndTurnHookModel.Child> & Model.Child = {},
    R extends Partial<EndTurnHookModel.Refer> & Model.Refer = {}
> extends FeatureModel<
    E & EndTurnHookModel.Event,
    S & EndTurnHookModel.State,
    C & EndTurnHookModel.Child,
    R & EndTurnHookModel.Refer
> {
    constructor(props: EndTurnHookModel['props'] & {
        uuid: string | undefined;
        state: S & Pick<FeatureModel.State, 'desc' | 'name'>;
        child: C;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: {
                status: 1,
                ...props.state,
            },
            child: {
                anchor: new AnchorModel({}),
                ...props.child,
            },
            refer: { ...props.refer },
        })
    }

    public run() {
        if (!this.state.status) return;
        this.event.toRun({});
        this.doRun();
        this.event.onRun({});
    }

    protected abstract doRun(): void;
}