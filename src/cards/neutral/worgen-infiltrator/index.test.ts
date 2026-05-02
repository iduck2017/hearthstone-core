/**
 * Scenario:
 * - playerA board: wispA (1/1) — current player, has 1 action
 * - playerB board: wispB (1/1, no stealth) + infiltrator (2/1, stealth)
 *
 * Test 1 — check-initial-state:
 *   Verify that infiltrator has stealth active, wispB and both heroes do not.
 *
 * Test 2 — stealth-restricts-target:
 *   wispA attacks; the target selector must exclude infiltrator (stealth),
 *   only offering wispB and playerB's hero.
 *   After selecting wispB: both die.
 *
 * Test 3 — stealth-removed-on-attack:
 *   infiltrator attacks wispA; infiltrator loses stealth immediately.
 *   After attack: infiltrator (2 hp - 1 dmg) survives at 1 hp, wispA dies.
 *
 */

import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { WispModel } from "../wisp";
import { WorgenInfiltratorModel } from "./index";
import { sleep } from "../../../utils/sleep";

describe('worgen-infiltrator', () => {
    const app = new AppModel();
    const wispA = new WispModel();
    const wispB = new WispModel();
    const infiltrator = new WorgenInfiltratorModel();
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
                cards: [wispB, infiltrator],
            }),
        }),
    });
    const playerA = game.playerA;
    const playerB = game.playerB;
    app.setGame(game);
    game.start();

    it('check-initial-state', () => {
        expect(playerA.hero.role.stealth.isActived).toBe(false);
        expect(playerB.hero.role.stealth.isActived).toBe(false);
        expect(wispB.role.stealth.isActived).toBe(false);
        expect(infiltrator.role.stealth.isActived).toBe(true);
        expect(wispA.role.action.isEnabled).toBe(true);
        expect(wispB.role.action.isEnabled).toBe(undefined);
    })

    it('stealth-restricts-target', async () => {
        wispA.role.action.launch();
        await sleep();
        const options = playerA.controller.selector?.options;
        expect(options).toContain(wispB.role);
        expect(options).toContain(playerB.hero.role);
        expect(options).not.toContain(infiltrator.role);
        playerA.controller.selectTarget(wispB.role);
        await sleep();
        expect(wispA.role.health.current).toBe(0);
        expect(wispB.role.health.current).toBe(0);
        expect(wispA.disposer.isActived).toBe(true);
        expect(wispB.disposer.isActived).toBe(true);
    })

    it('stealth-removed-on-attack', async () => {
        game.nextTurn();
        await sleep();
        expect(infiltrator.role.stealth.isActived).toBe(true);
        infiltrator.role.action.launch();
        await sleep();
        playerB.controller.selectTarget(playerA.hero.role);
        await sleep();
        expect(infiltrator.role.stealth.isActived).toBe(false);
    })

})
