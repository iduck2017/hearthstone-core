import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { ManaModel } from "../../../rules/mana";
import { ManaAddictModel } from "./index";
import { FireballModel } from "../../mage/fireball";
import { sleep } from "../../../utils/sleep";

describe("mana-addict", () => {
    const app = new AppModel();
    const manaAddict = new ManaAddictModel();
    const fireballA = new FireballModel();
    const fireballB = new FireballModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [manaAddict] }),
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
        expect(playerA.board.cards).toContain(manaAddict);
        expect(playerA.hand.cards).toContain(fireballA);
        expect(manaAddict.role.attack.current).toBe(1);
    });

    it("spell-grants-attack-buff", async () => {
        // Play fireball targeting playerB hero
        fireballA.launcher.run();
        await sleep();
        playerA.controller.selectTarget(playerB.hero.role);
        await sleep();

        expect(manaAddict.role.attack.current).toBe(3);
    });

    it("buff-stacks-per-spell", async () => {
        // Play a second fireball; buff should stack to +4
        fireballB.launcher.run();
        await sleep();
        playerA.controller.selectTarget(playerB.hero.role);
        await sleep();

        expect(manaAddict.role.attack.current).toBe(5);
    });

    it("buff-expires-at-turn-end", async () => {
        game.nextTurn();
        await sleep();

        expect(manaAddict.role.attack.current).toBe(1);
    });
});
