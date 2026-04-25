import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { BoardModel } from "../../../entities/board";
import { MageModel } from "../../../heroes/mage";
import { sleep } from "../../../utils/sleep";
import { StormwindChampionModel } from "./index";
import { WispModel } from "../wisp";
import { BoulderfistOgreModel } from "../boulderfist-ogre";

describe("stormwind-champion", () => {
    const app = new AppModel();
    const stormwindChampion = new StormwindChampionModel();
    const wispA = new WispModel();
    const boulderfistOgre = new BoulderfistOgreModel();
    const wispB = new WispModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [stormwindChampion, wispA] }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [boulderfistOgre, wispB] }),
        }),
    });
    const playerA = game.playerA;

    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    it("check-initial-state", () => {
        // Wisp gains +1/+1 from the aura; champion does not buff itself
        expect(wispA.role.attack.current).toBe(2);
        expect(wispA.role.health.maximum).toBe(2);
        expect(stormwindChampion.role.attack.current).toBe(6);
        expect(stormwindChampion.role.health.maximum).toBe(6);
    });

    it("wisp-takes-damage-while-buffed", async () => {
        // Wisp (2 atk) attacks enemyWisp (1 hp): enemyWisp dies, wisp takes 1 damage
        wispA.role.runAttack();
        await sleep();
        playerA.controller.selectTarget(wispB.role);
        await sleep();

        // Wisp is damaged but still alive; aura is still active
        expect(wispA.role.health.current).toBe(1);
        expect(wispA.role.health.maximum).toBe(2);
    });

    it("aura-removed-on-champion-death-health-stays-at-1", async () => {
        // Champion (6 atk) attacks ogre (6/7): champion dies, ogre survives
        stormwindChampion.role.runAttack();
        await sleep();
        playerA.controller.selectTarget(boulderfistOgre.role);
        await sleep();

        expect(stormwindChampion.disposer.isActived).toBe(true);
        // Aura lifted — wisp returns to base attack and max health
        expect(wispA.role.attack.current).toBe(1);
        expect(wispA.role.health.maximum).toBe(1);
        // Current health must not exceed the new max; wisp stays alive at 1
        expect(wispA.role.health.current).toBe(1);
    });
});
