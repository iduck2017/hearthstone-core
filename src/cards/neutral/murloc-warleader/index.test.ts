import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { MurlocWarleaderModel } from "./index";
import { MurlocRaiderModel } from "../murloc-raider";
import { WispModel } from "../wisp";
import { BoulderfistOgreModel } from "../boulderfist-ogre";
import { sleep } from "../../../utils/sleep";

describe("murloc-warleader", () => {
    const app = new AppModel();
    const murlocWarleader = new MurlocWarleaderModel();
    const murlocRaider = new MurlocRaiderModel();
    const wisp = new WispModel();
    const boulderfistOgre = new BoulderfistOgreModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [murlocWarleader, murlocRaider, wisp] }),
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
        // murlocRaider buffed: +2 Attack and +1 Health from aura
        expect(murlocRaider.role.attack.current).toBe(4);
        expect(murlocRaider.role.health.maximum).toBe(2);
        // wisp not buffed — not a Murloc
        expect(wisp.role.attack.current).toBe(1);
        expect(wisp.role.health.maximum).toBe(1);
        // warleader not self-buffed
        expect(murlocWarleader.role.attack.current).toBe(3);
        expect(murlocWarleader.role.health.maximum).toBe(3);
    });

    it("aura-removed-when-warleader-dies", async () => {
        // Warleader (3 atk) attacks Boulderfist Ogre (6 atk / 7 hp): warleader dies, ogre survives
        murlocWarleader.role.action.launch();
        await sleep();
        playerA.controller.selectTarget(boulderfistOgre.role);
        await sleep();

        expect(murlocWarleader.disposer.isActived).toBe(true);
        // Aura removed — murlocRaider reverts to base stats
        expect(murlocRaider.role.attack.current).toBe(2);
        expect(murlocRaider.role.health.maximum).toBe(1);
    });
});
