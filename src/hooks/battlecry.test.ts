import { AppModel } from "../app";
import { GameModel } from "../entities/game";
import { PlayerModel } from "../entities/player";
import { DeckModel } from "../entities/deck";
import { WispModel } from "../cards/wisp";
import { BoardModel } from "../entities/board";
import { HandModel } from "../entities/hand";
import { ElvenArcherModel } from "../cards/elven-archer/card";
import { sleep } from "../utils/sleep";
import { MageModel } from "../heroes/mage";

describe('battlecry', () => {
    const app = new AppModel();
    const game = new GameModel({
        players: [
            new PlayerModel({
                hero: new MageModel(),
                hand: new HandModel({
                    cards: [new ElvenArcherModel()],
                }),
            }),
            new PlayerModel({
                hero: new MageModel(),
                board: new BoardModel({
                    cards: [new WispModel()],
                }),
            }),
        ],
    });
    const playerA = game.players[0];
    const playerB = game.players[1];
    const wisp = playerB.board.minions[0];
    const elvenArcher = playerA.hand.cards[0];
    if (!wisp) throw new Error('Wisp not found');
    if (!elvenArcher) throw new Error('Elven Archer not found');
    app.setGame(game);
    game.start();

    it('check-initial-state', () => {
        expect(wisp.health.current).toBe(1);
        expect(game.currentPlayer).toBe(playerA);
        expect(playerA.mana.current).toBe(1);
        expect(elvenArcher.isPlayable).toBe(true)
    })

    it('play-elven-archer', async () => {
        elvenArcher.play();
        await sleep();
        playerA.controller.selectTarget(0);
        await sleep();
        const options = playerA.controller.selector?.options;
        expect(options).toContain(wisp);
        expect(options).not.toContain(elvenArcher);
        playerA.controller.selectTarget(wisp);
        await sleep();
        expect(playerB.board.minions.length).toBe(0);
        expect(playerA.hand.cards.length).toBe(0);
        expect(playerA.board.cards.length).toBe(1);

        expect(wisp.health.current).toBe(0);
        expect(wisp.isDisposable).toBe(true);
    })
})