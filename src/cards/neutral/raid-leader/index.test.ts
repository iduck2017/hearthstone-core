import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { BoardModel } from "../../../entities/board";
import { MageModel } from "../../../heroes/mage";
import { sleep } from "../../../utils/sleep";
import { RaidLeaderModel } from "./index";
import { WispModel } from "../wisp";
import { BoulderfistOgreModel } from "../boulderfist-ogre";

describe("raid-leader", () => {
    const app = new AppModel();
    const raidLeader = new RaidLeaderModel();
    const wisp = new WispModel();
    const boulderfistOgre = new BoulderfistOgreModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [raidLeader, wisp] }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [boulderfistOgre] }),
        }),
    });

    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    it("check-initial-state", () => {
        // Wisp gains +1 Attack from the aura; raidLeader does not buff itself
        expect(wisp.role.attack.current).toBe(2);
        expect(raidLeader.role.attack.current).toBe(2);
    });

    it("aura-removed-when-raid-leader-dies", async () => {
        // raidLeader (2 attack) attacks boulderfistOgre (6/7): raidLeader dies, ogre survives
        raidLeader.role.runAttack();
        await sleep();
        playerA.controller.selectTarget(boulderfistOgre.role);
        await sleep();

        expect(raidLeader.disposer.isActived).toBe(true);
        // Aura lifted — wisp returns to base attack
        expect(wisp.role.attack.current).toBe(1);
    });

    const playerA = game.playerA;
});
