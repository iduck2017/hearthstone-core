import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { WispModel } from "../wisp";
import { ElvenArcherModel } from "../elven-archer";
import { FlesheatingGhoulModel } from "./index";
import { sleep } from "../../../utils/sleep";

describe("flesheating-ghoul", () => {
    const app = new AppModel();
    const flesheatingGhoul = new FlesheatingGhoulModel();
    const wispA = new WispModel();
    const wispB = new WispModel();
    const elvenArcher = new ElvenArcherModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [flesheatingGhoul] }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [wispA, wispB] }),
            hand: new HandModel({ cards: [elvenArcher] }),
        }),
    });

    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    const playerA = game.playerA;
    const playerB = game.playerB;

    it("check-initial-state", () => {
        expect(playerA.board.cards).toContain(flesheatingGhoul);
        expect(playerB.board.cards).toContain(wispA);
        expect(playerB.board.cards).toContain(wispB);
        expect(playerB.hand.cards).toContain(elvenArcher);
        expect(flesheatingGhoul.role.attack.current).toBe(3);
    });

    it("battlecry-death-grants-plus-one-attack", async () => {
        game.nextTurn();
        await sleep();

        elvenArcher.deployer.launch();
        await sleep();
        playerB.controller.selectTarget(0);
        await sleep();
        playerB.controller.selectTarget(wispA.role);
        await sleep();
        expect(wispA.disposer.isActived).toBe(true);
        expect(flesheatingGhoul.role.attack.current).toBe(4);
    });

    it("combat-death-stacks-another-plus-one", async () => {
        game.nextTurn();
        await sleep();

        flesheatingGhoul.role.action.launch();
        await sleep();
        playerA.controller.selectTarget(wispB.role);
        await sleep();

        expect(flesheatingGhoul.role.attack.current).toBe(5);
        expect(wispB.disposer.isActived).toBe(true);
    });
});
