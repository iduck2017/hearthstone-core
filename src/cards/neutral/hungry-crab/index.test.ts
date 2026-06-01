import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { WispModel } from "../wisp";
import { MurlocRaiderModel } from "../murloc-raider";
import { HungryCrabModel } from "./index";
import { sleep } from "../../../utils/sleep";

describe("hungry-crab", () => {
    const app = new AppModel();
    const hungryCrab = new HungryCrabModel();
    const murloc = new MurlocRaiderModel();
    const wisp = new WispModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            hand: new HandModel({ cards: [hungryCrab] }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [murloc, wisp] }),
        }),
    });

    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    const playerA = game.playerA;
    const playerB = game.playerB;

    it("check-initial-state", () => {
        expect(playerA.hand.cards).toContain(hungryCrab);
        expect(playerB.board.cards).toContain(murloc);
        expect(playerB.board.cards).toContain(wisp);
        expect(hungryCrab.role.attack.current).toBe(1);
        expect(hungryCrab.role.health.current).toBe(2);
    });

    it("battlecry-selector-filters-murlocs-only", async () => {
        hungryCrab.deployer.launch();
        await sleep();
        playerA.controller.selectTarget(0);
        await sleep();
        const options = playerA.controller.selector?.options;
        expect(options).toContain(murloc);
        expect(options).not.toContain(wisp);
    });

    it("battlecry-destroys-murloc-and-gains-buff", async () => {
        playerA.controller.selectTarget(murloc);
        await sleep();
        expect(murloc.disposer.isActived).toBe(true);
        expect(wisp.disposer.isActived).toBe(false);
        expect(hungryCrab.role.attack.current).toBe(3);
        expect(hungryCrab.role.health.current).toBe(4);
    });
});
