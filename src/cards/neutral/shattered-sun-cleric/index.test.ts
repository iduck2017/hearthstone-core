import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { WispModel } from "../wisp";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { ShatteredSunClericModel } from "./index";
import { sleep } from "../../../utils/sleep";
import { MageModel } from "../../../heroes/mage";
import { ManaModel } from "../../../rules/mana";

describe('shattered-sun-cleric', () => {
    const app = new AppModel();
    const wisp = new WispModel();
    const shatteredSunCleric = new ShatteredSunClericModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            hand: new HandModel({
                cards: [shatteredSunCleric],
            }),
            board: new BoardModel({
                cards: [wisp],
            }),
            mana: new ManaModel({
                maximum: 2,
            }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
        }),
    });
    
    const playerA = game.playerA;

    if (!wisp) throw new Error('Wisp not found');
    if (!shatteredSunCleric) throw new Error('Shattered Sun Cleric not found');
    
    app.setGame(game);
    game.start();

    it('check-initial-state', () => {
        expect(wisp.role.attack.current).toBe(1);
        expect(wisp.role.health.current).toBe(1);
        expect(wisp.role.health.maximum).toBe(1);
        expect(game.currentPlayer).toBe(playerA);
        expect(playerA.mana.current).toBe(3);
        expect(shatteredSunCleric.isPlayable).toBe(true);
    })

    it('play-shattered-sun-cleric', async () => {
        shatteredSunCleric.play();
        await sleep();
        // Select board position (0 = before wisp)
        playerA.controller.selectTarget(0);
        await sleep();
        // Select target (wisp)
        const options = playerA.controller.selector?.options;
        expect(options).toContain(wisp.role);
        playerA.controller.selectTarget(wisp.role);
        await sleep();
        
        // Verify card is on board
        expect(playerA.hand.cards.length).toBe(0);
        expect(playerA.board.cards.length).toBe(2);
        expect(playerA.board.minions).toContain(shatteredSunCleric);
        
        // Verify wisp got +1/+1 buff
        expect(wisp.role.attack.current).toBe(2);
        expect(wisp.role.health.maximum).toBe(2);
        expect(wisp.role.health.current).toBe(2);
    })
})
