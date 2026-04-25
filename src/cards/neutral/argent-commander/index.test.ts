/**
 * Scenario:
 * - playerA hand: argentCommander (4/2, Charge, Divine Shield), mana max 5 (→ 6 after start)
 * - playerB board: wispA (1/1), wispB (1/1)
 *
 * Test 1 — check-initial-state:
 *   Verify argentCommander is in playerA's hand and playerB has two wisps.
 *
 * Test 2 — charge-attack-divine-shield-absorbs-counter:
 *   Play argentCommander. Charge lets it attack immediately.
 *   Commander attacks wispA — wispA dies (4 dmg), Divine Shield absorbs wispA's 1-dmg counter.
 *   Assert shield consumed and commander health unchanged at 2.
 *
 * Test 3 — takes-damage-after-shield-broken:
 *   Advance to playerB's turn. wispB attacks argentCommander.
 *   No shield: commander takes 1 damage (health = 1). wispB takes 4 and dies.
 */

import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { ManaModel } from "../../../rules/mana";
import { WispModel } from "../wisp";
import { ArgentCommanderModel } from "./index";
import { sleep } from "../../../utils/sleep";

describe("argent-commander", () => {
    const app = new AppModel();
    const argentCommander = new ArgentCommanderModel();
    const wispA = new WispModel();
    const wispB = new WispModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            hand: new HandModel({ cards: [argentCommander] }),
            mana: new ManaModel({ maximum: 5 }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [wispA, wispB] }),
        }),
    });

    app.setGame(game);
    game.start();

    const playerA = game.playerA;
    const playerB = game.playerB;

    it("check-initial-state", () => {
        expect(playerA.hand.cards).toContain(argentCommander);
        expect(playerB.board.minions.length).toBe(2);
    });

    it("charge-attack-divine-shield-absorbs-counter", async () => {
        argentCommander.play();
        await sleep();
        playerA.controller.selectTarget(0);
        await sleep();

        expect(playerA.board.minions).toContain(argentCommander);
        // Charge: can attack the same turn it was played
        expect(argentCommander.role.isAttackEnabled).toBe(true);

        argentCommander.role.runAttack();
        await sleep();
        playerA.controller.selectTarget(wispA.role);
        await sleep();

        expect(wispA.disposer.isActived).toBe(true);
        // Divine Shield absorbs wispA's 1-damage counter
        expect(argentCommander.role.divineShield.isActived).toBe(false);
        expect(argentCommander.role.health.current).toBe(2);
    });

    it("takes-damage-after-shield-broken", async () => {
        // Advance to playerB's turn so wispB can attack
        game.nextTurn();
        await sleep();

        wispB.role.runAttack();
        await sleep();
        playerB.controller.selectTarget(argentCommander.role);
        await sleep();

        // No shield: commander takes 1 damage
        expect(argentCommander.role.health.current).toBe(1);
        // wispB takes 4 counter damage and dies
        expect(wispB.disposer.isActived).toBe(true);
    });
});
