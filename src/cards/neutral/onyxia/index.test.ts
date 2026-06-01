import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { WarriorModel } from "../../../heroes/warrior";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { ManaModel } from "../../../rules/mana";
import { sleep } from "../../../utils/sleep";
import { OnyxiaModel } from "./index";
import { WispModel } from "../wisp";
import { WhelpModel } from "../../derivatives/whelp";

describe("onyxia", () => {
    const app = new AppModel();
    const onyxia = new OnyxiaModel();
    const wisp1 = new WispModel();
    const wisp2 = new WispModel();
    const wisp3 = new WispModel();

    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new WarriorModel(),
            board: new BoardModel({ cards: [wisp1, wisp2, wisp3] }),
            hand: new HandModel({ cards: [onyxia] }),
            mana: new ManaModel({ current: 10, maximum: 10 }),
        }),
        playerB: new PlayerModel({
            hero: new WarriorModel(),
            board: new BoardModel({ cards: [] }),
            hand: new HandModel({ cards: [] }),
            mana: new ManaModel({ current: 10, maximum: 10 }),
        }),
    });

    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    const playerA = game.playerA;

    it("summons-whelps-until-board-full", async () => {
        onyxia.deployer.launch();
        await sleep();
        playerA.controller.selectTarget(playerA.board.minions.length);
        await sleep();

        expect(playerA.board.minions.length).toBe(7);
        expect(playerA.board.minions[3]).toBe(onyxia);
        expect(playerA.board.minions[4] instanceof WhelpModel).toBe(true);
        expect(playerA.board.minions[5] instanceof WhelpModel).toBe(true);
        expect(playerA.board.minions[6] instanceof WhelpModel).toBe(true);
    });
});
