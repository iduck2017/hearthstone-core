import { Event, EventUtil, Method, Model  } from "set-piece";
import { FeatureModel } from "../features";
import { TurnModel } from "../rules/turn";
import { CardModel } from "../cards";

export namespace EndTurnHookModel {
    export type E = {
        onRun: Event;
    };
    export type S = {};
    export type C = {};
    export type R = {};
    export type P = {
        card: CardModel;
    }
}

export abstract class EndTurnHookModel<
    E extends Partial<EndTurnHookModel.E> & Model.E = {},
    S extends Partial<EndTurnHookModel.S> & Model.S = {},
    C extends Partial<EndTurnHookModel.C> & Model.C = {},
    R extends Partial<EndTurnHookModel.R> & Model.R = {},
> extends FeatureModel<
    E & EndTurnHookModel.E,
    S & EndTurnHookModel.S,
    C & EndTurnHookModel.C,
    R & EndTurnHookModel.R
> {
    constructor(props: EndTurnHookModel['props'] & {
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
        })
    }


    @EventUtil.on(self => self.handle)
    private listen() {
        return this.route.game?.proxy.child.turn.event?.doEnd;
    }

    protected handle(that: TurnModel, event: Event) {
        if (!this.state.isActive) return;

        const game = this.route.game;
        if (!game) return;
        const player = this.route.player;
        if (!player) return;
        const turn = game.child.turn;
        const current = turn.refer.current;
        const isCurrent = current === player;

        this.doRun(isCurrent);
        this.event.onRun(new Event({}));
    }

    protected abstract doRun(isCurrent: boolean): void;
}