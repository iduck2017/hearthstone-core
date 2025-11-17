import { DebugUtil, Event, EventUtil, Method, Model } from "set-piece";
import { FeatureModel } from "..";
import { TurnModel } from "../rules/turn";
import { CardFeatureModel } from "../card";

export namespace StartTurnHookModel {
    export type E = {
        onRun: Event;
    };
    export type S = {};
    export type C = {};
    export type R = {};
}

export abstract class StartTurnHookModel<
    E extends Partial<StartTurnHookModel.E> & Model.E = {},
    S extends Partial<StartTurnHookModel.S> & Model.S = {},
    C extends Partial<StartTurnHookModel.C> & Model.C = {},
    R extends Partial<StartTurnHookModel.R> & Model.R = {},
> extends CardFeatureModel<
    E & StartTurnHookModel.E,
    S & StartTurnHookModel.S,
    C & StartTurnHookModel.C,
    R & StartTurnHookModel.R
> {

    constructor(props: StartTurnHookModel['props'] & {
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

    public start() {
        if (!this.state.actived) return;

        const game = this.route.game;
        if (!game) return;
        const player = this.route.player;
        if (!player) return;
        const turn = game.child.turn;
        const current = turn.refer.current;
        const actived = current === player;

        const name = this.state.name;
        const desc = this.state.desc;
        DebugUtil.log(`${name} run (${desc})`);
        this.run(actived);
        this.event.onRun(new Event({}));
    }

    protected abstract run(actived: boolean): void;
}