import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { WarriorModel } from "../../../heroes/warrior";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { ManaModel } from "../../../rules/mana";
import { sleep } from "../../../utils/sleep";
import { MasterSmithModel } from "./index";
import { WispModel } from "../wisp";

describe("master-swordsmith", () => {
    const app = new AppModel();
    const masterSmith = new MasterSmithModel();
    const wispA = new WispModel();
    const wispB = new WispModel();

    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new WarriorModel(),
            board: new BoardModel({ cards: [masterSmith, wispA, wispB] }),
            hand: new HandModel({ cards: [] }),
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

    it("gives-random-friendly-minion-plus-one-attack", async () => {
        game.nextTurn();
        await sleep();

        expect(masterSmith.role.attack.current).toBe(1);
        const wispAAttack = wispA.role.attack.current;
        const wispBAttack = wispB.role.attack.current;
        expect(wispAAttack === 2 || wispBAttack === 2).toBe(true);
    });
});
