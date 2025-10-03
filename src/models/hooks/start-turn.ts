import { Event, EventUtil, Method, Model, Props } from "set-piece";
import { EndTurnHookModel } from "./end-turn";
import { FeatureModel, FeatureProps } from "../features";
import { TurnModel } from "../rules/turn";

export namespace StartTurnHookProps {
    export type E = {
        onRun: Event;
    };
    export type S = {};
    export type C = {};
    export type R = {};
    export type P = {}
}

export abstract class StartTurnHookModel<
    E extends Partial<StartTurnHookProps.E> & Props.E = {},
    S extends Partial<StartTurnHookProps.S> & Props.S = {},
    C extends Partial<StartTurnHookProps.C> & Props.C = {},
    R extends Partial<StartTurnHookProps.R> & Props.R = {},
    P extends Partial<StartTurnHookProps.P> & Props.P = {}
> extends FeatureModel<
    E & StartTurnHookProps.E,
    S & StartTurnHookProps.S,
    C & StartTurnHookProps.C,
    R & StartTurnHookProps.R,
    P & StartTurnHookProps.P
> {
    constructor(loader: Method<StartTurnHookModel['props'] & {
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
        });
    }

    
    @EventUtil.on(self => self.route.game?.proxy.child.turn.event.doStart)
    protected async onStart(that: TurnModel, event: Event) {
        if (!this.state.isActive) return;

        const game = this.route.game;
        if (!game) return;
        const player = this.route.player;
        if (!player) return;
        const turn = game.child.turn;
        const current = turn.refer.current;
        const isCurrent = current === player;

        await this.doRun(isCurrent);
        this.event.onRun(new Event({}));
    }

    protected abstract doRun(isCurrent: boolean): Promise<void>;
}