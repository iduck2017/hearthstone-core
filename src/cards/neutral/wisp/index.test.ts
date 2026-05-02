import { AppModel } from "../../../app";
import { BoardModel } from "../../../entities/board";
import { DeckModel } from "../../../entities/deck";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { WispModel } from "./index";
import { MageModel } from "../../../heroes/mage";
import { sleep } from "../../../utils/sleep";

describe('wisp', () => {
    const app = new AppModel();
    const wispA = new WispModel();
    const wispB = new WispModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({
                cards: [wispA],
            }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),  
            board: new BoardModel({
                cards: [wispB],
            }),
        }),
    });
    app.setGame(game);
    game.start();
    const playerA = game.playerA;
    const playerB = game.playerB;

    it('check-board', () => {
        expect(playerA.board.cards.length).toBe(1);
        expect(playerB.board.cards.length).toBe(1);
    })

    it('check-wisp', () => {
        expect(wispA.role.health.current).toBe(1);
        expect(wispB.role.health.current).toBe(1);
        expect(wispA.role.health.maximum).toBe(1);
        expect(wispB.role.health.maximum).toBe(1);

        expect(wispA.role.attack.current).toBe(1);
        expect(wispB.role.attack.current).toBe(1);

        expect(wispA.role.action.isEnabled).toBe(true);
        expect(wispB.role.action.isEnabled).toBe(undefined);
    })

    it('wisp-attack-wisp', async () => {
        wispA.role.runAction();
        await sleep();
        const options = playerA.controller.selector?.options;
        expect(options).toContain(wispB.role);
        expect(options).not.toContain(wispA.role);
        playerA.controller.selectTarget(wispB.role);
        await sleep();
        expect(wispA.role.health.maximum).toBe(1);
        expect(wispB.role.health.maximum).toBe(1);
        expect(wispA.role.health.current).toBe(0);
        expect(wispB.role.health.current).toBe(0);
    })

    it('check-graveyard', () => {
        expect(wispA.disposer.isActived).toBe(true);
        expect(wispB.disposer.isActived).toBe(true);
        expect(playerA.board.cards.length).toBe(0);
        expect(playerB.board.cards.length).toBe(0);
        expect(playerA.graveyard.cards.length).toBe(1);
        expect(playerB.graveyard.cards.length).toBe(1);
    })

});
