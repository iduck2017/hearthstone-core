import { Event, EventUtil, Method, Model, Props } from "set-piece";
import { MinionCardModel } from "../cards/minion";
import { FeatureModel, FeatureProps } from "../features";
import { TurnModel } from "../rules/turn";

export namespace EndTurnHookProps {
    export type E = {
        onRun: Event;
    };
    export type S = {};
    export type C = {};
    export type R = {};
    export type P = {}
}

export abstract class EndTurnHookModel<
    E extends Partial<EndTurnHookProps.E> & Props.E = {},
    S extends Partial<EndTurnHookProps.S> & Props.S = {},
    C extends Partial<EndTurnHookProps.C> & Props.C = {},
    R extends Partial<EndTurnHookProps.R> & Props.R = {},
    P extends Partial<EndTurnHookProps.P> & Props.P = {}
> extends FeatureModel<
    E & EndTurnHookProps.E,
    S & EndTurnHookProps.S,
    C & EndTurnHookProps.C,
    R & EndTurnHookProps.R,
    P & EndTurnHookProps.P
> {
    constructor(loader: Method<EndTurnHookModel['props'] & {
        uuid: string | undefined;
        state: S & Pick<FeatureProps.S, 'desc' | 'name'>;
        child: C;
        refer: R;
        route: P;
    }, []>) {
        super(() => {
            const props = loader?.();
            return {
                uuid: props.uuid,
                state: {
                    isActive: true,
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: { ...props.route },
            }
        })
    }
        
    @EventUtil.on(self => self.route.game?.proxy.child.turn.event.doEnd)
    protected onEnd(that: TurnModel, event: Event) {
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