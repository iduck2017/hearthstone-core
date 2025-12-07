import { DebugService, Event, Method, Model } from "set-piece";
import { PlayerModel } from "../entities/player";
import { GameModel } from "../entities/game";

export namespace TurnModel {
    export type S = {
        current: number;
    };
    export type E = {
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
            game: result.items.find(item => item instanceof GameModel),
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

    @DebugService.span()
    private start() {
        const player = this.refer.current;
        const board = player?.child.board;
        if (!board) return;
        DebugService.log(`${player.name} Turn Start`);
        
        const game = this.route.game;
        if (!game) return;

        const playerA = game.child.playerA;
        const playerB = game.child.playerB;
        const heroA = playerA.child.hero;
        const heroB = playerB.child.hero;
        heroA.child.weapon?.reload();
        heroB.child.weapon?.reload();

        const allies = player.refer.roles;
        const opponent = player.refer.opponent;
        if (!opponent) return;
        const entities = [
            ...game.refer.cards,
            heroA.child.weapon,
            heroB.child.weapon,
            playerA,
            playerB,
            heroA,
            heroB,
        ]
        entities.forEach(item => {
            item?.child.turnStart.forEach(item => item.run())
        })
        
        // reset mana
        player.child.mana.reset();
        // reset actions
        allies.forEach(item => item.child.action.reset())
        allies.forEach(item => item.child.sleep.disable())
        // draw card
        if (!game?.state.debug?.isDrawDisabled) {
            player.child.hand.draw();
        }
        this.event.onStart(new Event({}));
    }
    
    @DebugService.span()
    private end() {
        const player = this.refer.current;
        const board = player?.child.board;
        if (!board) return;
        DebugService.log(`${player.name} Turn End`);

        const game = this.route.game;
        if (!game) return;

        const playerA = game.child.playerA;
        const playerB = game.child.playerB;
        const heroA = playerA.child.hero;
        const heroB = playerB.child.hero;

        const entities = [
            ...game.refer.cards,
            heroA.child.weapon,
            heroB.child.weapon,
            playerA,
            playerB,
            heroA,
            heroB,
        ]
        entities.forEach(item => {
            item?.child.turnEnd.forEach(item => item.run())
        })

        const roles = player.refer.roles;
        roles.forEach(item => {
            item.child.frozen.reset();
        });
        this.event.onEnd(new Event({}));
    }

}