import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { HandModel } from "../../../entities/hand";
import { ManaModel } from "../../../rules/mana";
import { MageModel } from "../../../heroes/mage";
import { PriestessOfEluneModel } from "./index";
import { sleep } from "../../../utils/sleep";

describe("priestess-of-elune", () => {
    const app = new AppModel();
    const priestess = new PriestessOfEluneModel();

    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            hand: new HandModel({ cards: [priestess] }),
            mana: new ManaModel({ maximum: 6 }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
        }),
    });

    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    const playerA = game.playerA;

    // Hero has taken 10 damage: 30 - 10 = 20 current health
    playerA.hero.role.health['_current'] = 20;

    it("check-initial-state", () => {
        expect(playerA.hand.cards).toContain(priestess);
        expect(playerA.hero.role.health.current).toBe(20);
        expect(playerA.hero.role.health.maximum).toBe(30);
    });

    it("battlecry-restores-four-health-to-hero", async () => {
        priestess.deployer.launch();
        await sleep();
        playerA.controller.selectTarget(0);
        await sleep();

        expect(playerA.board.cards).toContain(priestess);
        expect(playerA.hero.role.health.current).toBe(24);
        expect(playerA.hero.role.health.maximum).toBe(30);
    });
});
