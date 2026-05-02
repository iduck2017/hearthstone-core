import { DeckModel } from "./deck";
import { GameModel } from "./game";
import { PlayerModel } from "./player";
import { MageModel } from "../heroes/mage";
import { AppModel } from "../app";
import { WispModel } from "../cards/neutral/wisp";

describe('game', () => {
    const app = new AppModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            deck: new DeckModel({
                cards: new Array(30).fill(0).map(() => new WispModel()),
            }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            deck: new DeckModel({
                cards: new Array(30).fill(0).map(() => new WispModel()),
            }),
        }),
    });
    const playerA = game.playerA;
    const playerB = game.playerB;

    it('check-initial-state', () => {
        expect(app.game).toBeUndefined();
        expect(game.parent).toBeUndefined();
        app.setGame(game);
        expect(app.game).toBe(game);
        expect(game.parent).toBe(app);
        expect(game.playerA).toBeDefined();
        expect(game.playerB).toBeDefined();
        expect(game.isStarted).toBe(false);

        expect(playerA.deck.cards.length).toBe(30);
        expect(playerA.mana.current).toBe(0);
        expect(playerA.mana.maximum).toBe(0);
    })

    it('start-game', () => {
        game.start();
        expect(playerA.deck.cards.length).toBe(27);
        expect(playerB.deck.cards.length).toBe(26);
        expect(playerA.hand.cards.length).toBe(3);
        expect(playerB.hand.cards.length).toBe(4);

        expect(playerB.mana.current).toBe(0);
        expect(playerA.mana.maximum).toBe(1);
        expect(playerA.mana.current).toBe(1);
    })

    it('play-card', async () => {
        expect(game.currentPlayer).toBe(playerA);
        const wispA = playerA.hand.cards[0];
        const wispB = playerA.hand.cards[1];
        const wispC = playerB.hand.cards[0];

        expect(wispA?.deployer.isPlayable).toBe(true);
        expect(wispB?.deployer.isPlayable).toBe(true);
        expect(wispC?.deployer.isPlayable).toBe(false);

        const promiseA = wispA?.deployer.launch();
        playerA.controller.selectTarget(0);
        await promiseA;
        expect(playerA.board.cards[0]).toBe(wispA);
        expect(playerA.board.cards.length).toBe(1);
        expect(playerA.hand.cards.length).toBe(2);
        
        const promiseB = wispB?.deployer.launch();
        playerA.controller.selectTarget(0);
        await promiseB;
        expect(playerA.board.cards[0]).toBe(wispB);
        expect(playerA.board.cards[1]).toBe(wispA);
        expect(playerA.board.cards.length).toBe(2);
        expect(playerA.hand.cards.length).toBe(1);
    })

});