import { DebugUtil, Event, EventUtil, Method, Model  } from "set-piece";
import { TurnModel } from "../../rules/turn";
import { CardModel, AbortEvent } from "../../..";
import { FeatureModel } from "../";

export namespace TurnEndModel {
    export type E = {
        toRun: AbortEvent;
        onRun: Event;
    };
    export type S = {};
    export type C = {};
    export type R = {};
}

export abstract class TurnEndModel<
    E extends Partial<TurnEndModel.E> & Model.E = {},
    S extends Partial<TurnEndModel.S> & Model.S = {},
    C extends Partial<TurnEndModel.C> & Model.C = {},
    R extends Partial<TurnEndModel.R> & Model.R = {},
> extends FeatureModel<
    E & TurnEndModel.E,
    S & TurnEndModel.S,
    C & TurnEndModel.C,
    R & TurnEndModel.R
> {
    public get route() {
        const result = super.route;
        const card: CardModel | undefined = result.items.find(item => item instanceof CardModel);
        return {
            ...result,
            card,
        }
    }
    
    constructor(props: TurnEndModel['props'] & {
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
        })
    }


    public run() {
        if (!this.isActived) return;
        // toRun
        const event = new AbortEvent({});
        this.event.toRun(event);
        const isValid = event.detail.isValid;
        if (!isValid) return;

        // run
        const player = this.route.player;
        if (!player) return;
        const isCurrent = player.state.isCurrent;
        this.doRun(isCurrent);

        // onRun
        const name = this.state.name;
        const desc = this.state.desc;
        DebugUtil.log(`${name} run: ${desc}`);
        this.event.onRun(new Event({}));
    }

    protected abstract doRun(isCurrent: boolean): void;
}