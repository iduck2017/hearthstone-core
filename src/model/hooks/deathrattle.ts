import { Model } from "set-piece";
import { CardModel } from "../card";
import { FeatureModel } from "../feature";
import { AbortEvent } from "../../utils/abort";
import { AnchorModel } from "../rules/anchor";
import { PlayerModel } from "../players";

export namespace DeathrattleModel {
    export type Event = {
        toRun: AbortEvent;
        onRun: {};
    };
    export type State = {};
    export type Child = {};
    export type Refer = {};
}

export abstract class DeathrattleModel<
    E extends Partial<DeathrattleModel.Event> & Model.Event = {},
    S extends Partial<DeathrattleModel.State> & Model.State = {},
    C extends Partial<DeathrattleModel.Child> & Model.Child = {},
    R extends Partial<DeathrattleModel.Refer> & Model.Refer = {}
> extends FeatureModel<
    E & DeathrattleModel.Event, 
    S & DeathrattleModel.State, 
    C & DeathrattleModel.Child, 
    R & DeathrattleModel.Refer
> {

    constructor(props: DeathrattleModel['props'] & {
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
        });
    }

    public async run() {
        if (!this.state.status) return;
        const event = this.event.toRun(new AbortEvent());
        if (event.isAbort) return;
        await this.doRun();
        this.event.onRun({});
    }

    protected abstract doRun(): Promise<void>;
}