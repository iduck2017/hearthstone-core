import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { SilverHandKnightModel } from "./index";
import { SquireModel } from "../../derivatives/squire";
import { sleep } from "../../../utils/sleep";
import { MageModel } from "../../../heroes/mage";
import { ManaModel } from "../../../rules/mana";

describe('silver-hand-knight', () => {
    const app = new AppModel();
    const silverHandKnight = new SilverHandKnightModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            hand: new HandModel({
                cards: [silverHandKnight],
            }),
            board: new BoardModel(),
            mana: new ManaModel({
                maximum: 4,
            }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
        }),
    });
    
    const playerA = game.playerA;

    if (!silverHandKnight) throw new Error('Silver Hand Knight not found');
    
    app.setGame(game);
    game.start();

    it('check-initial-state', () => {
        expect(playerA.board.cards.length).toBe(0);
        expect(game.currentPlayer).toBe(playerA);
        expect(playerA.mana.current).toBe(5);
        expect(silverHandKnight.isPlayable).toBe(true);
    })

    it('play-silver-hand-knight', async () => {
        silverHandKnight.play();
        await sleep();
        playerA.controller.selectTarget(0);
        await sleep();
        
        expect(playerA.hand.cards.length).toBe(0);
        expect(playerA.board.cards.length).toBe(2);
        expect(playerA.board.minions).toContain(silverHandKnight);
        
        const index = playerA.board.cards.indexOf(silverHandKnight);
        expect(index).toBe(0);
        const squire = playerA.board.cards[1];
        expect(squire).toBeInstanceOf(SquireModel);
    })
})
