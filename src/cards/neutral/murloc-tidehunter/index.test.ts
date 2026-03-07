import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { MurlocTidehunterModel } from "./index";
import { MurlocScoutModel } from "../../derivatives/murloc-scout";
import { sleep } from "../../../utils/sleep";
import { MageModel } from "../../../heroes/mage";
import { ManaModel } from "../../../rules/mana";

describe('murloc-tidehunter', () => {
    const app = new AppModel();
    const murlocTidehunter = new MurlocTidehunterModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            hand: new HandModel({
                cards: [murlocTidehunter],
            }),
            board: new BoardModel(),
            mana: new ManaModel({
                maximum: 1,
            }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
        }),
    });
    
    const playerA = game.playerA;

    if (!murlocTidehunter) throw new Error('Murloc Tidehunter not found');
    
    app.setGame(game);
    game.start();

    it('check-initial-state', () => {
        expect(playerA.board.cards.length).toBe(0);
        expect(game.currentPlayer).toBe(playerA);
        expect(playerA.mana.current).toBe(2);
        expect(murlocTidehunter.isPlayable).toBe(true);
    })

    it('play-murloc-tidehunter', async () => {
        murlocTidehunter.play();
        await sleep();
        // Select board position (0 = first position)
        playerA.controller.selectTarget(0);
        await sleep();
        
        // Verify card is on board
        expect(playerA.hand.cards.length).toBe(0);
        expect(playerA.board.cards.length).toBe(2);
        expect(playerA.board.minions).toContain(murlocTidehunter);
        
        // Verify Murloc Scout was summoned to the right of Tidehunter
        const index = playerA.board.cards.indexOf(murlocTidehunter);
        expect(index).toBe(0);
        const scout = playerA.board.cards[1];
        expect(scout).toBeInstanceOf(MurlocScoutModel);
    })
})
