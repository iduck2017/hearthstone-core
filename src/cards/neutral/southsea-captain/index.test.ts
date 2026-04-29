import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { SouthseaCaptainModel } from "./index";
import { BoulderfistOgreModel } from "../boulderfist-ogre";
import { sleep } from "../../../utils/sleep";

describe("southsea-captain", () => {
    const app = new AppModel();
    // Two captains: each buffs the other (neither buffs itself)
    const southseaCaptain = new SouthseaCaptainModel();
    const southseaCaptainB = new SouthseaCaptainModel();
    const boulderfistOgre = new BoulderfistOgreModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [southseaCaptain, southseaCaptainB] }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [boulderfistOgre] }),
        }),
    });
    const playerA = game.playerA;
    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    it("check-initial-state", () => {
        // Each captain gets +1/+1 from the other captain's aura
        expect(southseaCaptain.role.attack.current).toBe(4);
        expect(southseaCaptain.role.health.maximum).toBe(4);
        expect(southseaCaptainB.role.attack.current).toBe(4);
        expect(southseaCaptainB.role.health.maximum).toBe(4);
    });

    it("aura-removed-when-captain-dies", async () => {
        // Captain (4 atk) attacks Boulderfist Ogre (6 atk / 7 hp): captain dies, ogre survives
        southseaCaptain.role.runAttack();
        await sleep();
        playerA.controller.selectTarget(boulderfistOgre.role);
        await sleep();

        expect(southseaCaptain.disposer.isActived).toBe(true);
        // southseaCaptainB loses southseaCaptain's aura — back to base 3/3
        expect(southseaCaptainB.role.attack.current).toBe(3);
        expect(southseaCaptainB.role.health.maximum).toBe(3);
    });
});
