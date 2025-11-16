import { DebugUtil, Event, EventUtil, Method, Model  } from "set-piece";
import { TurnModel } from "../rules/turn";
import { FeatureModel, CardModel } from "../../..";
import { CardFeatureModel } from "../card";

export namespace EndTurnHookModel {
    export type E = {
        onRun: Event;
    };
    export type S = {};
    export type C = {};
    export type R = {};
}

export abstract class EndTurnHookModel<
    E extends Partial<EndTurnHookModel.E> & Model.E = {},
    S extends Partial<EndTurnHookModel.S> & Model.S = {},
    C extends Partial<EndTurnHookModel.C> & Model.C = {},
    R extends Partial<EndTurnHookModel.R> & Model.R = {},
> extends CardFeatureModel<
    E & EndTurnHookModel.E,
    S & EndTurnHookModel.S,
    C & EndTurnHookModel.C,
    R & EndTurnHookModel.R
> {
    public get route() {
        const result = super.route;
        const card: CardModel | undefined = result.items.find(item => item instanceof CardModel);
        return {
            ...result,
            card,
        }
    }
    
    constructor(props: EndTurnHookModel['props'] & {
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
        })
    }

    public start(that: TurnModel, event: Event) {
        if (!this.state.actived) return;

        const game = this.route.game;
        if (!game) return;
        const player = this.route.player;
        if (!player) return;
        const turn = game.child.turn;
        const current = turn.refer.current;
        const actived = current === player;

        DebugUtil.log(`${this.state.name} run (${this.state.desc})`);
        this.run(actived);
        this.event.onRun(new Event({}));
    }

    protected abstract run(actived: boolean): void;
}