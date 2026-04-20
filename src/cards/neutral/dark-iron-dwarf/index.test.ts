import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { DeckModel } from "../../../entities/deck";
import { DarkIronDwarfModel } from "./index";
import { WispModel } from "../wisp";
import { sleep } from "../../../utils/sleep";
import { ManaModel } from "../../../rules/mana";

describe("dark-iron-dwarf", () => {
    const app = new AppModel();
    const darkIronDwarf = new DarkIronDwarfModel();
    const wisp = new WispModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            hand: new HandModel({ cards: [darkIronDwarf] }),
            board: new BoardModel({ cards: [wisp] }),
            deck: new DeckModel(),
            mana: new ManaModel({ maximum: 5 }),
        }),
        playerB: new PlayerModel({ hero: new MageModel() }),
    });
    const playerA = game.playerA;
    app.setGame(game);
    game.start();

    it("check-initial-state", () => {
        expect(playerA.board.cards).toContain(wisp);
        expect(wisp.role.attack.current).toBe(1);
        expect(playerA.hand.cards).toContain(darkIronDwarf);
        expect(playerA.mana.current).toBeGreaterThanOrEqual(4);
    });

    it("battlecry-gives-friendly-minion-plus-two-attack-until-turn-end", async () => {
        darkIronDwarf.play();
        await sleep();
        playerA.controller.selectTarget(0);
        await sleep();
        const options = playerA.controller.selector?.options;
        expect(options).toContain(wisp.role);
        playerA.controller.selectTarget(wisp.role);
        await sleep();

        expect(wisp.role.attack.current).toBe(3);
        expect(game.turn).toBe(1);
        game.nextTurn();
        expect(game.turn).toBe(2);
        expect(wisp.role.attack.current).toBe(1);
    });
});
