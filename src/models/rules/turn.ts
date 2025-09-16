import { Event, Loader, Method, Model } from "set-piece";
import { PlayerModel } from "../player";
import { GameModel } from "../game";

export namespace TurnProps {
    export type S = {
        count: number;
    };
    export type E = {
        onEnd: void;
        onStart: void;
    };
    export type C = {};
    export type R = {
        current?: PlayerModel;
    };
    export type P = {
        game: GameModel;
    }
}

export class TurnModel extends Model<
    TurnProps.E, 
    TurnProps.S, 
    TurnProps.C, 
    TurnProps.R,
    TurnProps.P
> {
    constructor(loader?: Loader<TurnModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    count: 0,
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: { game: GameModel.prototype },
            }
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
        const player = this.refer.current;
        const board = player?.child.board;
        if (!board) return;
        const roles = player.refer.roles;
        player.child.mana.reset();
        roles.forEach(item => {
            const entries = item.child.entries;
            item.child.action.reset();
            item.child.sleep.deactive();
        });
        this.event.onStart();
    }
    
    private end() {
        const player = this.refer.current;
        const board = player?.child.board;
        if (!board) return;
        const roles = player.refer.roles;
        player.child.mana.reset();
        roles.forEach(item => {
            const entries = item.child.entries;
            if (!item.child.action.state.isActive) return;
            entries.child.frozen.deactive();
        });
        this.event.onEnd();
    }
}