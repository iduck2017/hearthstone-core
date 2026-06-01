import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { WarriorModel } from "../../../heroes/warrior";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { ManaModel } from "../../../rules/mana";
import { sleep } from "../../../utils/sleep";
import { RagnarosTheFirelordModel } from "./index";
import { WispModel } from "../wisp";

describe("ragnaros-the-firelord", () => {
    const app = new AppModel();
    const ragnaros = new RagnarosTheFirelordModel();
    const wisp = new WispModel();

    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new WarriorModel(),
            board: new BoardModel({ cards: [ragnaros] }),
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

    const playerB = game.playerB;
    const heroB = playerB.hero;

    it("deals-damage-to-random-enemy-on-turn-end", async () => {
        game.nextTurn();
        await sleep();
        const heroHealthChanged = heroB.role.health.current === 22;
        const wispDestroyed = playerB.board.minions.length === 0;
        expect(heroHealthChanged || wispDestroyed).toBe(true);
    });
});
