import { Model } from "set-piece";
import { PlayerModel } from "../player";
import { GameModel } from ".";

export namespace TurnModel {
    export type State = {
        count: number;
    };
    export type Event = {
        toEnd: {};
        onEnd: {};
        toStart: {};
        onStart: {};
    };
    export type Child = {};
    export type Refer = {
        current?: PlayerModel;
    };
}

export class TurnModel extends Model<
    TurnModel.Event, 
    TurnModel.State, 
    TurnModel.Child, 
    TurnModel.Refer
> {

    public get route() {
        const route = super.route;
        return {
            ...route,
            game: route.path.find(item => item instanceof GameModel)
        }
    }

    constructor(props: TurnModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                count: 0,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }

    public next() {
        this.end();
        this.draft.refer.current = 
            this.refer.current?.refer.opponent ?? 
            this.route.game?.child.playerA;
        this.draft.state.count ++;
        this.start();
    }

    private start() {
        this.event.toStart({});
        const player = this.refer.current;
        const board = player?.child.board;
        if (!board) return;
        const cards = board.child.cards;
        cards.forEach(card => card.child.role.child.action.reset());
        cards.forEach(card => card.child.startTurnHooks.forEach(hook => hook.run()));
        this.event.onStart({});
    }
    
    private end() {
        this.event.toEnd({});
        const player = this.refer.current;
        const board = player?.child.board;
        if (!board) return;
        const cards = board.child.cards;
        cards?.forEach(card => card.child.endTurnHooks.forEach(hook => hook.run()));
        this.event.onEnd({});
    }
}