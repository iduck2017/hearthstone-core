import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { CairneBloodhoofModel } from "./index";
import { BaineBloodhoofModel } from "../../derivatives/baine-bloodhoof";
import { BoulderfistOgreModel } from "../boulderfist-ogre";
import { sleep } from "../../../utils/sleep";

describe("cairne-bloodhoof", () => {
    const app = new AppModel();
    const cairneBloodhoof = new CairneBloodhoofModel();
    const boulderfistOgre = new BoulderfistOgreModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [cairneBloodhoof] }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [boulderfistOgre] }),
        }),
    });

    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    const playerA = game.playerA;
    const playerB = game.playerB;

    it("check-initial-state", () => {
        expect(playerA.board.cards).toContain(cairneBloodhoof);
        expect(playerB.board.cards).toContain(boulderfistOgre);
    });

    it("deathrattle-summons-baine-on-death", async () => {
        game.nextTurn();
        await sleep();

        boulderfistOgre.role.runAttack();
        await sleep();
        playerB.controller.selectTarget(cairneBloodhoof.role);
        await sleep();

        expect(cairneBloodhoof.disposer.isActived).toBe(true);
        expect(playerA.board.minions.length).toBe(1);
        const token = playerA.board.minions[0];
        expect(token).toBeInstanceOf(BaineBloodhoofModel);
        expect(token?.role.attack.current).toBe(5);
        expect(token?.role.health.current).toBe(5);
    });
});
