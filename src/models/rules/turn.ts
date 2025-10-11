import { DebugUtil, Event, Method, Model } from "set-piece";
import { PlayerModel } from "../player";
import { GameModel } from "../game";

export namespace TurnModel {
    export type S = {
        current: number;
    };
    export type E = {
        doEnd: Event;
        doStart: Event;
        onEnd: Event;
        onStart: Event;
    };
    export type C = {};
    export type R = {
        current?: PlayerModel;
    };
}

export class TurnModel extends Model<
    TurnModel.E, 
    TurnModel.S, 
    TurnModel.C, 
    TurnModel.R
> {
    public get route() {
        const result = super.route;
        return {
            ...result,
            game: result.list.find(item => item instanceof GameModel),
        }
    }

    constructor(props?: TurnModel['props']) {
        super({
            uuid: props?.uuid,
            state: {
                current: 0,
                ...props?.state,
            },
            child: { ...props?.child },
            refer: { ...props?.refer },
        })
    }

    public next() {
        this.end();
        const current = this.refer.current;
        const game = this.route.game;
        this.origin.refer.current = current?.refer.opponent ?? game?.child.playerA;
        this.origin.state.current ++;
        this.start();
    }

    private start() {
        const player = this.refer.current;
        const board = player?.child.board;
        if (!board) return;
        const roles = player.query();
        player.child.mana.reset();
        roles.forEach(item => {
            item.child.action.reset();
            item.child.sleep.deactive();
        });
        // draw a card
        const game = this.route.game;
        if (!game?.state.debug?.isDrawDisabled) {
            player.child.deck.draw();
        }
        this.event.doStart(new Event({}));
        this.event.onStart(new Event({}));
    }
    
    private end() {
        const player = this.refer.current;
        const board = player?.child.board;
        if (!board) return;
        const roles = player.query();
        roles.forEach(item => {
            const entries = item.child.feats;
            if (item.child.action.state.current <= 0) return;
            entries.child.frozen.deactive();
        });
        this.event.doEnd(new Event({}));
        this.event.onEnd(new Event({}));
    }
}