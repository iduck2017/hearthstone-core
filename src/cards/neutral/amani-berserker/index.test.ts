import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { WispModel } from "../wisp";
import { AmaniBerserkerModel } from "./index";
import { sleep } from "../../../utils/sleep";

describe("amani-berserker", () => {
    const app = new AppModel();
    const amaniBerserker = new AmaniBerserkerModel();
    const wisp = new WispModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [amaniBerserker] }),
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
        expect(playerA.board.cards).toContain(amaniBerserker);
        expect(playerB.board.cards).toContain(wisp);
        expect(amaniBerserker.role.attack.current).toBe(2);
    });

    it("enrage-gains-attack-while-damaged", async () => {
        game.nextTurn();
        await sleep();

        wisp.role.action.launch();
        await sleep();
        playerB.controller.selectTarget(amaniBerserker.role);
        await sleep();

        expect(amaniBerserker.role.health.current).toBe(2);
        expect(amaniBerserker.role.health.maximum).toBe(3);
        expect(amaniBerserker.role.attack.current).toBe(5);
        expect(wisp.disposer.isActived).toBe(true);
    });
});
