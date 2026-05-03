import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { WarriorModel } from "../../../heroes/warrior";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { ManaModel } from "../../../rules/mana";
import { sleep } from "../../../utils/sleep";
import { SeaGiantModel } from "./index";
import { MurlocRaiderModel } from "../murloc-raider";
import { WispModel } from "../wisp";

describe("sea-giant", () => {
    const app = new AppModel();
    const seaGiant = new SeaGiantModel();
    const raider = new MurlocRaiderModel();
    const wisp = new WispModel();

    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new WarriorModel(),
            board: new BoardModel({ cards: [raider] }),
            hand: new HandModel({ cards: [seaGiant] }),
            mana: new ManaModel({ current: 10, maximum: 10 }),
        }),
        playerB: new PlayerModel({
            hero: new WarriorModel(),
            board: new BoardModel({ cards: [wisp] }),
            hand: new HandModel({ cards: [] }),
            mana: new ManaModel({ current: 10, maximum: 10 }),
        }),
    });

    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    const playerA = game.playerA;
    const playerB = game.playerB;

    it("cost-reduced-by-minion-count", async () => {
        expect(seaGiant.cost.current).toBe(8);
    });

    it("cost-restored-when-minions-destroyed", async () => {
        raider.role.action.launch();
        await sleep();
        playerA.controller.selectTarget(wisp.role);
        await sleep();

        expect(playerA.board.minions).toEqual([]);
        expect(playerB.board.minions).toEqual([]);
        expect(seaGiant.cost.current).toBe(10);
    });
});
