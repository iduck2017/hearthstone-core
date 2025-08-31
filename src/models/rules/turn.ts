import { Event, Model } from "set-piece";
import { PlayerModel } from "../player";
import { GameModel } from "../game";

export namespace TurnProps {
    export type S = {
        count: number;
    };
    export type E = {
        toEnd: Event;
        onEnd: Event;
        toStart: Event;
        onStart: Event;
    };
    export type C = {};
    export type R = {
        current?: PlayerModel;
    };
}

export class TurnModel extends Model<
    TurnProps.E, 
    TurnProps.S, 
    TurnProps.C, 
    TurnProps.R
> {
    public get route() {
        const route = super.route;
        return {
            ...route,
            game: route.order.find(item => item instanceof GameModel)
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
        const current = this.refer.current;
        const game = this.route.game;
        this.draft.refer.current = current?.refer.opponent ?? game?.child.playerA;
        this.draft.state.count ++;
        this.start();
    }

    private start() {
        this.event.toStart(new Event({}));
        const player = this.refer.current;
        const board = player?.child.board;
        if (!board) return;
        const minions = board.child.minions;
        player.child.mana.reset();
        // rule
        minions.forEach(item => {
            const role = item.child.role;
            const entries = role.child.entries;
            role.child.action.reset();
            role.child.sleep.deactive();
            entries.child.rush.overdue();
            entries.child.frozen.deactive();
        });
        // hooks
        minions.forEach(item => {
            const hooks = item.child.hooks;
            hooks.child.startTurn.forEach(hook => hook.run());
        });
        this.event.onStart(new Event({}));
    }
    
    private end() {
        this.event.toEnd(new Event({}));
        const player = this.refer.current;
        const board = player?.child.board;
        if (!board) return;
        const minions = board.child.minions;
        minions?.forEach(item => {
            const hooks = item.child.hooks;
            hooks.child.endTurn.forEach(hook => hook.run());
        });
        this.event.onEnd(new Event({}));
    }
}