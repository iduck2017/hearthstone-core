/**
 * Scenario:
 * - playerA board: wispA (1/1) + wispB (1/1) — current player, wispA has 1 action
 * - playerB board: squire (1/1, divine shield)
 *
 * Test 1 — check-initial-state:
 *   Verify squire has divine shield active; wisps and heroes do not.
 *
 * Test 2 — divine-shield-absorbs-first-hit:
 *   wispA attacks squire; the shield absorbs the damage — squire survives at 1 hp,
 *   divine shield is now inactive. wispA takes 1 damage from squire's counter and dies.
 *
 * Test 3 — attack-after-shield-broken:
 *   Next turn: wispB now has 1 action. wispB attacks squire (no shield left);
 *   both take 1 damage and die.
 */

import { AppModel } from "../app";
import { GameModel } from "../entities/game";
import { PlayerModel } from "../entities/player";
import { MageModel } from "../heroes/mage";
import { BoardModel } from "../entities/board";
import { WispModel } from "../cards/wisp";
import { ArgentSquireModel } from "../cards/argent-squire";
import { sleep } from "../utils/sleep";

describe('divine-shield', () => {
    const app = new AppModel();
    const wispA = new WispModel();
    const wispB = new WispModel();
    const squire = new ArgentSquireModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({
                cards: [wispA, wispB],
            }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({
                cards: [squire],
            }),
        }),
    });
    const playerA = game.playerA;
    app.setGame(game);
    game.start();

    it('check-initial-state', () => {
        expect(squire.role.divineShield.isActived).toBe(true);
        expect(wispA.role.divineShield.isActived).toBe(false);
        expect(wispB.role.divineShield.isActived).toBe(false);
        expect(wispA.role.action.current).toBe(1);
        expect(wispB.role.action.current).toBe(1);
    })

    it('divine-shield-absorbs-first-hit', async () => {
        wispA.role.attackRole();
        await sleep();
        playerA.controller.selectTarget(squire.role);
        await sleep();
        expect(squire.role.divineShield.isActived).toBe(false);
        expect(squire.role.health.current).toBe(1);
        expect(squire.disposer.isActived).toBe(false);
        expect(wispA.role.health.current).toBe(0);
        expect(wispA.disposer.isActived).toBe(true);
    })

    it('attack-after-shield-broken', async () => {
        wispB.role.attackRole();
        await sleep();
        playerA.controller.selectTarget(squire.role);
        await sleep();
        expect(squire.role.health.current).toBe(0);
        expect(squire.disposer.isActived).toBe(true);
        expect(wispB.role.health.current).toBe(0);
        expect(wispB.disposer.isActived).toBe(true);
    })
})
