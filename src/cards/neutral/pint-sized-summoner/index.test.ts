import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { ManaModel } from "../../../rules/mana";
import { sleep } from "../../../utils/sleep";
import { PintSizedSummonerModel } from "./index";
import { IronfurGrizzlyModel } from "../ironfur-grizzly";
import { FireballModel } from "../../mage/fireball";

describe("pint-sized-summoner", () => {
    const app = new AppModel();
    const pintSized = new PintSizedSummonerModel();
    const grizzlyA = new IronfurGrizzlyModel();
    const grizzlyB = new IronfurGrizzlyModel();
    const fireball = new FireballModel();

    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [pintSized] }),
            hand: new HandModel({ cards: [grizzlyA, grizzlyB] }),
            mana: new ManaModel({ current: 10, maximum: 10 }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            hand: new HandModel({ cards: [fireball] }),
            mana: new ManaModel({ current: 10, maximum: 10 }),
        }),
    });

    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    const playerA = game.playerA;
    const playerB = game.playerB;

    it("discount-applies-to-minions-in-hand", () => {
        expect(grizzlyA.cost.current).toBe(2);
        expect(grizzlyB.cost.current).toBe(2);
    });

    it("discount-consumed-after-first-minion-played", async () => {
        grizzlyA.deployer.launch();
        await sleep();
        playerA.controller.selectTarget(0);
        await sleep();
        expect(grizzlyB.cost.current).toBe(3);
    });

    it("discount-resets-after-turn-end", () => {
        game.nextTurn();
        game.nextTurn();
        expect(grizzlyB.cost.current).toBe(2);
    });

    it("no-discount-after-pint-sized-dies", async () => {
        game.nextTurn();
        fireball.deployer.launch();
        await sleep();
        playerB.controller.selectTarget(pintSized.role);
        await sleep();
        game.nextTurn();
        expect(grizzlyB.cost.current).toBe(3);
    });
});
