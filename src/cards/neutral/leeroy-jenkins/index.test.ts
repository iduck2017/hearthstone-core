import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { ManaModel } from "../../../rules/mana";
import { LeeroyJenkinsModel } from "./index";
import { WhelpModel } from "../../derivatives/whelp";
import { sleep } from "../../../utils/sleep";

describe("leeroy-jenkins", () => {
    const app = new AppModel();
    const leeroyJenkins = new LeeroyJenkinsModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            hand: new HandModel({ cards: [leeroyJenkins] }),
            board: new BoardModel(),
            mana: new ManaModel({ maximum: 4 }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel(),
        }),
    });

    app.setGame(game);
    game.start();

    const playerA = game.playerA;
    const playerB = game.playerB;

    it("check-initial-state", () => {
        expect(playerA.hand.cards).toContain(leeroyJenkins);
        expect(playerB.board.minions.length).toBe(0);
    });

    it("battlecry-summons-two-whelps-for-opponent", async () => {
        leeroyJenkins.deployer.launch();
        await sleep();
        playerA.controller.selectTarget(0);
        await sleep();

        expect(playerA.board.minions).toContain(leeroyJenkins);
        expect(playerB.board.minions.length).toBe(2);
        for (const whelp of playerB.board.minions) {
            expect(whelp).toBeInstanceOf(WhelpModel);
            expect(whelp.role.attack.current).toBe(1);
            expect(whelp.role.health.current).toBe(1);
        }
        // Charge: leeroy can attack the same turn it was played
        expect(leeroyJenkins.role.action.isEnabled).toBe(true);
    });
});
