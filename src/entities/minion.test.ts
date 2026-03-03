import { AppModel } from "../app";
import { BoardModel } from "./board";
import { DeckModel } from "./deck";
import { GameModel } from "./game";
import { PlayerModel } from "./player";
import { WispModel } from "../cards/wisp";
import { MageModel } from "../heroes/mage";

describe('attack', () => {
    const app = new AppModel();
    const wispA = new WispModel();
    const wispB = new WispModel();
    const game = new GameModel({
        players: [
            new PlayerModel({
                hero: new MageModel(),
                board: new BoardModel({
                    cards: [wispA],
                }),
            }),
            new PlayerModel({
                hero: new MageModel(),  
                board: new BoardModel({
                    cards: [wispB],
                }),
            }),
        ],  
    });
    app.setGame(game);
    game.start();

    const boardA = game.players[0].board;
    const boardB = game.players[1].board;
    const graveyardA = game.players[0].graveyard;
    const graveyardB = game.players[1].graveyard;

    it('check-board', () => {
        expect(boardA.cards.length).toBe(1);
        expect(boardB.cards.length).toBe(1);
    })

    it('check-wisp', () => {
        expect(wispA.health.current).toBe(1);
        expect(wispB.health.current).toBe(1);
        expect(wispA.health.maximum).toBe(1);
        expect(wispB.health.maximum).toBe(1);

        expect(wispA.attack.current).toBe(1);
        expect(wispB.attack.current).toBe(1);
    })

    it('wisp-attack-wisp', () => {
        wispA.attackMinion({
            target: wispB,
        });
        expect(wispA.health.maximum).toBe(1);
        expect(wispB.health.maximum).toBe(1);
        expect(wispA.health.current).toBe(0);
        expect(wispB.health.current).toBe(0);

    })

    it('check-graveyard', () => {
        expect(wispA.isDisposable).toBe(true);
        expect(wispB.isDisposable).toBe(true);
        expect(boardA.cards.length).toBe(0);
        expect(boardB.cards.length).toBe(0);
        expect(graveyardA.cards.length).toBe(1);
        expect(graveyardB.cards.length).toBe(1);
    })
    
});