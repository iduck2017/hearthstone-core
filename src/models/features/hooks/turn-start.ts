import { DebugUtil, Event, EventUtil, Method, Model } from "set-piece";
import { FeatureModel } from "..";
import { TurnModel } from "../../rules/turn";
import { CardFeatureModel } from "../card";
import { AbortEvent } from "../../../types/events/abort";

export namespace TurnStartModel {
    export type E = {
        toRun: AbortEvent;
        onRun: Event;
    };
    export type S = {};
    export type C = {};
    export type R = {};
}

export abstract class TurnStartModel<
    E extends Partial<TurnStartModel.E> & Model.E = {},
    S extends Partial<TurnStartModel.S> & Model.S = {},
    C extends Partial<TurnStartModel.C> & Model.C = {},
    R extends Partial<TurnStartModel.R> & Model.R = {},
> extends CardFeatureModel<
    E & TurnStartModel.E,
    S & TurnStartModel.S,
    C & TurnStartModel.C,
    R & TurnStartModel.R
> {
    constructor(props: TurnStartModel['props'] & {
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
        if (!isValid) return;
        // run
        const player = this.route.player;
        if (!player) return;
        const game = this.route.game;
        if (!game) return;
        const turn = game.child.turn;
        const current = turn.refer.current;
        const isCurrent = current === player;
        this.doRun(isCurrent);
        // onRun
        const name = this.state.name;
        const desc = this.state.desc;
        DebugUtil.log(`${name} run: ${desc}`);
        this.event.onRun(new Event({}));
    }

    protected abstract doRun(isCurrent: boolean): void;
}