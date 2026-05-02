/**
 * Scenario:
 * - playerA board: grimscaleOracle (1/1 Murloc), murlocRaider (2/1 Murloc), wisp (1/1)
 * - playerB board: boulderfistOgre (6/7)
 *
 * Test 1 — check-initial-state:
 *   murlocRaider gets +1 Attack from aura (attack = 3).
 *   wisp is not buffed (not a Murloc). Oracle is not self-buffed.
 *
 * Test 2 — aura-removed-when-oracle-dies:
 *   grimscaleOracle attacks boulderfistOgre → oracle dies, ogre survives.
 *   murlocRaider attack drops back to 2.
 */

import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { WispModel } from "../wisp";
import { MurlocRaiderModel } from "../murloc-raider";
import { BoulderfistOgreModel } from "../boulderfist-ogre";
import { GrimscaleOracleModel } from "./index";
import { sleep } from "../../../utils/sleep";

describe("grimscale-oracle", () => {
    const app = new AppModel();
    const grimscaleOracle = new GrimscaleOracleModel();
    const murlocRaider = new MurlocRaiderModel();
    const wisp = new WispModel();
    const boulderfistOgre = new BoulderfistOgreModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [grimscaleOracle, murlocRaider, wisp] }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [boulderfistOgre] }),
        }),
    });

    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    const playerA = game.playerA;

    it("check-initial-state", () => {
        expect(murlocRaider.role.attack.current).toBe(3);
        expect(wisp.role.attack.current).toBe(1);
        expect(grimscaleOracle.role.attack.current).toBe(1);
    });

    it("aura-removed-when-oracle-dies", async () => {
        grimscaleOracle.role.action.launch();
        await sleep();
        playerA.controller.selectTarget(boulderfistOgre.role);
        await sleep();

        expect(grimscaleOracle.disposer.isActived).toBe(true);
        expect(murlocRaider.role.attack.current).toBe(2);
    });
});
