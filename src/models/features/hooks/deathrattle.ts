import { DebugUtil, Event, Method, Model } from "set-piece";
import { AbortEvent } from "../../../types/events/abort";
import { FeatureModel, CardModel } from "../../..";
import { CardFeatureModel } from "../card";

export namespace DeathrattleModel {
    export type E = {
        toRun: AbortEvent;
        onRun: Event;
    };
    export type S = {};
    export type C = {};
    export type R = {};
}

export abstract class DeathrattleModel<
    E extends Partial<DeathrattleModel.E> & Model.E = {},
    S extends Partial<DeathrattleModel.S> & Model.S = {},
    C extends Partial<DeathrattleModel.C> & Model.C = {},
    R extends Partial<DeathrattleModel.R> & Model.R = {},
> extends CardFeatureModel<
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
                actived: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @DebugUtil.span()
    public start() {
        if (!this.state.actived) return;
        
        const event = new AbortEvent({});
        this.event.toRun(event);
        if (event.detail.aborted) return;

        const name = this.state.name;
        const desc = this.state.desc;
        DebugUtil.log(`${name} run (${desc})`);
        this.run();
        this.event.onRun(new Event({}));
    }

    protected abstract run(): void;
}