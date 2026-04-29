import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { ManaModel } from "../../../rules/mana";
import { NightbladeModel } from "./index";
import { sleep } from "../../../utils/sleep";

describe("nightblade", () => {
    const app = new AppModel();
    const nightblade = new NightbladeModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel(),
            hand: new HandModel({ cards: [nightblade] }),
            mana: new ManaModel({ maximum: 10, current: 10 }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel(),
        }),
    });
    const playerA = game.playerA;
    const playerB = game.playerB;
    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    it("check-initial-state", () => {
        expect(playerA.hand.cards).toContain(nightblade);
        expect(playerB.hero.role.health.current).toBe(30);
    });

    it("battlecry-deals-three-damage-to-enemy-hero", async () => {
        // Play Nightblade; battlecry fires immediately (no target selection)
        nightblade.launcher.run();
        await sleep();
        playerA.controller.selectTarget(0); // select board position
        await sleep();

        expect(playerB.hero.role.health.current).toBe(27);
    });
});
