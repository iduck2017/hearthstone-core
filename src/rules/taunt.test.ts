import { AppModel } from "../app";      
import { GameModel } from "../entities/game";
import { PlayerModel } from "../entities/player";
import { MageModel } from "../heroes/mage";
import { BoardModel } from "../entities/board";
import { WispModel } from "../cards/neutral/wisp";
import { GoldshineFootmanModel } from "../cards/neutral/goldshine-footman";
import { sleep } from "../utils/sleep";

/**
 * Scenario:
 * - playerA board: wispA (1/1) — current player, has 1 action
 * - playerB board: wispB (1/1, no taunt) + footman (1/2, taunt)
 *
 * Test 1 — check-initial-state:
 *   Verify that footman has taunt active, wispB and both heroes do not.
 *
 * Test 2 — taunt-restricts-target:
 *   wispA attacks; the target selector must only offer footman (taunt),
 *   excluding wispB and playerB's hero.
 *   After selecting footman: wispA (1 hp - 1 dmg) dies, footman (2 hp - 1 dmg) survives at 1 hp.
 */
describe('taunt', () => {
    const app = new AppModel();
    const wispA = new WispModel();
    const wispB = new WispModel();
    const footman = new GoldshineFootmanModel();
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
                cards: [wispB, footman],
            }),
        }),
    });
    const playerA = game.playerA;
    const playerB = game.playerB;
    app.setGame(game);
    game.start();

    it('check-initial-state', () => {
        expect(playerA.hero.role.taunt.isActived).toBe(false);
        expect(playerB.hero.role.taunt.isActived).toBe(false);
        expect(wispB.role.taunt.isActived).toBe(false);
        expect(footman.role.taunt.isActived).toBe(true);
        expect(wispA.role.action.current).toBe(1);
        expect(wispB.role.action.current).toBe(0);
    })

    it('taunt-restricts-target', async () => {
        wispA.role.runAttack();
        await sleep();
        const options = playerA.controller.selector?.options;
        expect(options).toContain(footman.role);
        expect(options).not.toContain(wispB.role);
        expect(options).not.toContain(playerB.hero.role);
        playerA.controller.selectTarget(footman.role);
        await sleep();
        expect(wispA.role.health.current).toBe(0);
        expect(footman.role.health.current).toBe(1);
        expect(wispA.disposer.isActived).toBe(true);
        expect(footman.disposer.isActived).toBe(false);
    })
})