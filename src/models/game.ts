import { Event, Method, Model, TemplUtil, TranxUtil } from "set-piece";
import { PlayerModel } from "./player";
import { TurnModel } from "./rules/turn";
import { TheCoinModel } from "..";

export namespace GameModel {
    export type S = {
        readonly debug?: {
            readonly isDrawDisabled: boolean;
        }
    };
    export type E = {
        onStart: Event;
    };
    export type C = {
        readonly turn: TurnModel;
        readonly playerA: PlayerModel;
        readonly playerB: PlayerModel;
    };
    export type R = {};
}


@TemplUtil.is('game')
export class GameModel extends Model<
    GameModel.E, 
    GameModel.S, 
    GameModel.C,
    GameModel.R
> {
    public get chunk() {
        return {
            turn: this.origin.child.turn.state.current,
            playerA: this.origin.child.playerA.chunk,
            playerB: this.origin.child.playerB.chunk,
        }
    }

    constructor(props?: GameModel['props']) {
        props = props ?? {};
        const child = props?.child ?? {};
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                playerA: child.playerA ?? new PlayerModel(),
                playerB: child.playerB ?? new PlayerModel(),
                turn: child.turn ?? new TurnModel(),
                ...props.child
            },
            refer: { ...props.refer },
        });
    }


    public start() {
        this.doStart();
        this.event.onStart(new Event({}));
        this.child.turn.next();
    }
 
    @TranxUtil.span()
    private doStart() {
        const playerA = this.child.playerA;
        const handA = playerA.child.hand;
        const deckA = playerA.child.deck;
        const cardsA = deckA.refer.queue.slice(0, 3);
        for (const card of cardsA) {
            deckA.del(card);
            handA.add(card);
        }
        const playerB = this.child.playerB;
        const handB = playerB.child.hand;
        const deckB = playerB.child.deck;
        handB.add(new TheCoinModel());
        const cardsB = deckB.refer.queue.slice(0, 4);
        for (const card of cardsB) {
            deckB.del(card);
            handB.add(card);
        }
    }

    public query(isMinion?: boolean) {
        const playerA = this.child.playerA;
        const playerB = this.child.playerB;
        const minions = [
            ...playerA.query(isMinion),
            ...playerB.query(isMinion)
        ];
        return minions;
    }
}