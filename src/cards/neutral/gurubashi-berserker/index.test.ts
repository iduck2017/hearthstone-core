import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { WispModel } from "../wisp";
import { ElvenArcherModel } from "../elven-archer";
import { GurubashiBerserkerModel } from "./index";
import { sleep } from "../../../utils/sleep";

describe("gurubashi-berserker", () => {
    const app = new AppModel();
    const gurubashiBerserker = new GurubashiBerserkerModel();
    const wisp = new WispModel();
    const elvenArcher = new ElvenArcherModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [gurubashiBerserker] }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [wisp] }),
            hand: new HandModel({ cards: [elvenArcher] }),
        }),
    });

    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    const playerA = game.playerA;
    const playerB = game.playerB;

    it("check-initial-state", () => {
        expect(playerA.board.cards).toContain(gurubashiBerserker);
        expect(playerB.board.cards).toContain(wisp);
        expect(playerB.hand.cards).toContain(elvenArcher);
        expect(gurubashiBerserker.role.attack.current).toBe(2);
    });

    it("combat-hit-grants-plus-three-attack", async () => {
        game.nextTurn();
        await sleep();

        wisp.role.action.launch();
        await sleep();
        playerB.controller.selectTarget(gurubashiBerserker.role);
        await sleep();

        expect(gurubashiBerserker.role.health.current).toBe(6);
        expect(gurubashiBerserker.role.attack.current).toBe(5);
        expect(wisp.disposer.isActived).toBe(true);
    });

    it("battlecry-hit-stacks-another-plus-three", async () => {
        elvenArcher.deployer.launch();
        await sleep();
        playerB.controller.selectTarget(0);
        await sleep();
        playerB.controller.selectTarget(gurubashiBerserker.role);
        await sleep();

        expect(gurubashiBerserker.role.health.current).toBe(5);
        expect(gurubashiBerserker.role.attack.current).toBe(8);
    });
});
