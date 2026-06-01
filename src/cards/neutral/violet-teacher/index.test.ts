import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { ManaModel } from "../../../rules/mana";
import { VioletTeacherModel } from "./index";
import { VioletApprenticeModel } from "../../derivatives/violet-apprentice";
import { FireballModel } from "../../mage/fireball";
import { sleep } from "../../../utils/sleep";

describe("violet-teacher", () => {
    const app = new AppModel();
    const teacher = new VioletTeacherModel();
    const fireballA = new FireballModel();
    const fireballB = new FireballModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [teacher] }),
            hand: new HandModel({ cards: [fireballA, fireballB] }),
            mana: new ManaModel({ current: 10, maximum: 10 }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
        }),
    });

    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    const playerA = game.playerA;
    const playerB = game.playerB;

    it("check-initial-state", () => {
        expect(playerA.board.minions).toContain(teacher);
        expect(playerA.board.minions.length).toBe(1);
    });

    it("spell-summons-apprentice", async () => {
        fireballA.deployer.launch();
        await sleep();
        playerA.controller.selectTarget(playerB.hero.role);
        await sleep();

        expect(playerA.board.minions.length).toBe(2);
        expect(playerA.board.minions[1]).toBeInstanceOf(VioletApprenticeModel);
    });

    it("second-spell-summons-another-apprentice", async () => {
        fireballB.deployer.launch();
        await sleep();
        playerA.controller.selectTarget(playerB.hero.role);
        await sleep();

        expect(playerA.board.minions.length).toBe(3);
    });
});
