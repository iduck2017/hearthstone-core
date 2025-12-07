import { DebugService, Event, Model, ChunkService, TranxService } from "set-piece";
import { PlayerModel } from "./player";
import { TurnModel } from "../rules/turn";
import { AppModel, CardModel, MinionCardModel, TheCoinModel } from "../..";
import { RoleModel } from "./heroes";

export namespace GameModel {
    export type S = {
        readonly debug?: {
            readonly isDrawDisabled?: boolean;
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


@ChunkService.is('game')
export class GameModel extends Model<
    GameModel.E, 
    GameModel.S, 
    GameModel.C,
    GameModel.R
> {
    public get chunk() {
        const child = this.child;
        return {
            turn: child.turn.state.current,
            playerA: child.playerA.chunk,
            playerB: child.playerB.chunk,
        }
    }

    public get refer() {
        const child = this.child;
        const minions: MinionCardModel[] = [
            ...child.playerA.refer.minions, 
            ...child.playerB.refer.minions,
        ];
        const roles: RoleModel[] = [
            ...child.playerA.refer.roles, 
            ...child.playerB.refer.roles,
        ];
        const cards: CardModel[] = [
            ...child.playerA.refer.cards,
            ...child.playerB.refer.cards,
        ];
        return {
            ...super.refer,
            minions,
            roles,
            cards,
        }
    }


    public get route() {
        const result = super.route;
        return {
            ...result,
            app: result.items.find(item => item instanceof AppModel),
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
        DebugService.log('Game Start');
        this.doStart();
        this.onStart();
    }
    
    @TranxService.span()
    private doStart() {
        const playerA = this.child.playerA;
        const handA = playerA.child.hand;
        const deckA = playerA.child.deck;
        const cardsA = deckA.child.cards.slice(0, 3);
        for (const card of cardsA) {
            deckA.del(card);
            handA.add(card);
        }
        const playerB = this.child.playerB;
        const handB = playerB.child.hand;
        const deckB = playerB.child.deck;
        handB.add(new TheCoinModel());
        const cardsB = deckB.child.cards.slice(0, 4);
        for (const card of cardsB) {
            deckB.del(card);
            handB.add(card);
        }
    }

    private onStart() {
        this.event.onStart(new Event({}));
        this.child.turn.next();
    }
}