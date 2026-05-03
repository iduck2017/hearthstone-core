import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { WarriorModel } from "../../../heroes/warrior";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { ManaModel } from "../../../rules/mana";
import { sleep } from "../../../utils/sleep";
import { DoomsayerModel } from "./index";
import { WispModel } from "../wisp";
import { MurlocRaiderModel } from "../murloc-raider";

describe("doomsayer", () => {
    const app = new AppModel();
    const doomsayer = new DoomsayerModel();
    const wisp = new WispModel();
    const raider = new MurlocRaiderModel();

    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new WarriorModel(),
            board: new BoardModel({ cards: [wisp] }),
            hand: new HandModel({ cards: [doomsayer] }),
            mana: new ManaModel({ current: 10, maximum: 10 }),
        }),
        playerB: new PlayerModel({
            hero: new WarriorModel(),
            board: new BoardModel({ cards: [raider] }),
            hand: new HandModel({ cards: [] }),
            mana: new ManaModel({ current: 10, maximum: 10 }),
        }),
    });

    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    const playerA = game.playerA;
    const playerB = game.playerB;

    it("deploy-doomsayer", async () => {
        doomsayer.deployer.launch();
        await sleep();
        playerA.controller.selectTarget(0);
        await sleep();

        expect(playerA.board.minions).toContain(doomsayer);
        expect(playerA.board.minions).toContain(wisp);
    });

    it("no-trigger-on-enemy-turn", async () => {
        game.nextTurn();
        await sleep();

        expect(playerA.board.minions).toContain(doomsayer);
        expect(playerA.board.minions).toContain(wisp);
        expect(playerB.board.minions).toContain(raider);
    });

    it("destroys-all-on-own-turn-start", async () => {
        game.nextTurn();
        await sleep();

        expect(playerA.board.minions).toEqual([]);
        expect(playerB.board.minions).toEqual([]);
    });
});
