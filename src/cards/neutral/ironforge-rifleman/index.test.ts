import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { DeckModel } from "../../../entities/deck";
import { IronforgeRiflemanModel } from "./index";
import { WispModel } from "../wisp";
import { sleep } from "../../../utils/sleep";
import { ManaModel } from "../../../rules/mana";

describe("ironforge-rifleman", () => {
    const app = new AppModel();
    const ironforgeRifleman = new IronforgeRiflemanModel();
    const wisp = new WispModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            hand: new HandModel({ cards: [ironforgeRifleman] }),
            board: new BoardModel(),
            deck: new DeckModel(),
            mana: new ManaModel({ maximum: 3 }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [wisp] }),
        }),
    });
    const playerA = game.playerA;
    const playerB = game.playerB;
    app.setGame(game);
    game.start();

    it("check-initial-state", () => {
        expect(playerB.board.cards).toContain(wisp);
        expect(wisp.role.health.current).toBe(1);
        expect(playerA.hand.cards).toContain(ironforgeRifleman);
    });

    it("battlecry-deals-one-damage-to-enemy-minion", async () => {
        ironforgeRifleman.play();
        await sleep();
        playerA.controller.selectTarget(0);
        await sleep();
        const options = playerA.controller.selector?.options;
        expect(options).toContain(wisp.role);
        playerA.controller.selectTarget(wisp.role);
        await sleep();

        expect(wisp.role.health.current).toBe(0);
        expect(wisp.disposer.isActived).toBe(true);
    });
});
