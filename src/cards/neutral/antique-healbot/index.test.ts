import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { HandModel } from "../../../entities/hand";
import { ManaModel } from "../../../rules/mana";
import { MageModel } from "../../../heroes/mage";
import { AntiqueHealbotModel } from "./index";
import { sleep } from "../../../utils/sleep";

describe("antique-healbot", () => {
    const app = new AppModel();
    const healbot = new AntiqueHealbotModel();

    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            hand: new HandModel({ cards: [healbot] }),
            mana: new ManaModel({ maximum: 5 }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
        }),
    });

    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    const playerA = game.playerA;

    // Hero has taken 15 damage: 30 - 15 = 15 current health
    playerA.hero.role.health['_current'] = 15;

    it("check-initial-state", () => {
        expect(playerA.hand.cards).toContain(healbot);
        expect(playerA.hero.role.health.current).toBe(15);
        expect(playerA.hero.role.health.maximum).toBe(30);
    });

    it("battlecry-restores-eight-health-to-hero", async () => {
        healbot.deployer.launch();
        await sleep();
        playerA.controller.selectTarget(0);
        await sleep();

        expect(playerA.board.cards).toContain(healbot);
        expect(playerA.hero.role.health.current).toBe(23);
        expect(playerA.hero.role.health.maximum).toBe(30);
    });
});
