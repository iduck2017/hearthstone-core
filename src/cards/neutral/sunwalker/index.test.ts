/**
 * Scenario:
 * - playerA board: wispA (1/1), wispB (1/1) — current player
 * - playerB board: sunwalker (4/5, Taunt, Divine Shield)
 *
 * Test 1 — check-initial-state:
 *   Verify sunwalker has both Taunt and Divine Shield active.
 *
 * Test 2 — divine-shield-absorbs-first-attack:
 *   wispA attacks sunwalker. Divine Shield absorbs the 1-damage hit;
 *   wispA takes 4 counter damage and dies. sunwalker remains at 5 health.
 *
 * Test 3 — takes-damage-after-shield-broken:
 *   wispB attacks sunwalker (no shield left). sunwalker takes 1 damage (health = 4);
 *   wispB takes 4 counter damage and dies.
 */

import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { WispModel } from "../wisp";
import { SunwalkerModel } from "./index";
import { sleep } from "../../../utils/sleep";

describe("sunwalker", () => {
    const app = new AppModel();
    const wispA = new WispModel();
    const wispB = new WispModel();
    const sunwalker = new SunwalkerModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [wispA, wispB] }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [sunwalker] }),
        }),
    });

    app.setGame(game);
    game.start();

    const playerA = game.playerA;

    it("check-initial-state", () => {
        expect(sunwalker.role.divineShield.isActived).toBe(true);
        expect(sunwalker.role.taunt.isActived).toBe(true);
    });

    it("divine-shield-absorbs-first-attack", async () => {
        wispA.role.action.launch();
        await sleep();
        playerA.controller.selectTarget(sunwalker.role);
        await sleep();

        expect(wispA.disposer.isActived).toBe(true);
        // Divine Shield absorbs wispA's 1-damage hit
        expect(sunwalker.role.divineShield.isActived).toBe(false);
        expect(sunwalker.role.health.current).toBe(5);
    });

    it("takes-damage-after-shield-broken", async () => {
        wispB.role.action.launch();
        await sleep();
        playerA.controller.selectTarget(sunwalker.role);
        await sleep();

        // Shield gone: sunwalker takes 1 damage
        expect(sunwalker.role.health.current).toBe(4);
        // wispB takes 4 counter damage and dies
        expect(wispB.disposer.isActived).toBe(true);
    });
});
