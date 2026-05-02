import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { WispModel } from "../wisp";
import { TaurenWarriorModel } from "./index";
import { sleep } from "../../../utils/sleep";

describe("tauren-warrior", () => {
    const app = new AppModel();
    const taurenWarrior = new TaurenWarriorModel();
    const wisp = new WispModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [taurenWarrior] }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [wisp] }),
        }),
    });

    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    const playerA = game.playerA;
    const playerB = game.playerB;

    it("check-initial-state", () => {
        expect(playerA.board.cards).toContain(taurenWarrior);
        expect(playerB.board.cards).toContain(wisp);
        expect(taurenWarrior.role.taunt.isActived).toBe(true);
        expect(taurenWarrior.role.attack.current).toBe(2);
    });

    it("taunt-forces-wisp-to-attack-taunter", async () => {
        game.nextTurn();
        await sleep();

        // Taunt forces all attack options to be taurenWarrior; hero is excluded.
        const options = wisp.role.attack.getSelector()?.options;
        expect(options).toContain(taurenWarrior.role);
        expect(options).not.toContain(playerA.hero.role);
    });

    it("enrage-gains-attack-while-damaged", async () => {
        wisp.role.action.launch();
        await sleep();
        playerB.controller.selectTarget(taurenWarrior.role);
        await sleep();

        expect(taurenWarrior.role.health.current).toBe(2);
        expect(taurenWarrior.role.health.maximum).toBe(3);
        expect(taurenWarrior.role.attack.current).toBe(5);
        expect(wisp.disposer.isActived).toBe(true);
    });
});
