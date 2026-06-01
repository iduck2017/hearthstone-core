import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { WarriorModel } from "../../../heroes/warrior";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { ManaModel } from "../../../rules/mana";
import { sleep } from "../../../utils/sleep";
import { BaronGeddonModel } from "./index";
import { WispModel } from "../wisp";

describe("baron-geddon", () => {
    const app = new AppModel();
    const baronGeddon = new BaronGeddonModel();
    const wisp = new WispModel();

    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new WarriorModel(),
            board: new BoardModel({ cards: [baronGeddon] }),
            hand: new HandModel({ cards: [] }),
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
    const heroA = playerA.hero;
    const heroB = playerB.hero;

    it("deals-damage-on-turn-end", async () => {
        game.nextTurn();
        await sleep();
        expect(baronGeddon.role.health.current).toBe(7);
        expect(heroA.role.health.current).toBe(28);
        expect(heroB.role.health.current).toBe(28);
        expect(playerB.board.minions).toEqual([]);
    });

    it("no-damage-on-enemy-turn-end", async () => {
        game.nextTurn();
        await sleep();

        expect(heroA.role.health.current).toBe(28);
        expect(heroB.role.health.current).toBe(28);
    });
});
