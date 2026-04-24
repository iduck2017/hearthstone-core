import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { HandModel } from "../../../entities/hand";
import { ManaModel } from "../../../rules/mana";
import { InjuredBlademasterModel } from "./index";
import { sleep } from "../../../utils/sleep";

describe("injured-blademaster", () => {
    const app = new AppModel();
    const injuredBlademaster = new InjuredBlademasterModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            hand: new HandModel({ cards: [injuredBlademaster] }),
            mana: new ManaModel({ maximum: 3 }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
        }),
    });

    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    const playerA = game.playerA;

    it("check-initial-state", () => {
        expect(playerA.hand.cards).toContain(injuredBlademaster);
        expect(playerA.board.cards.length).toBe(0);
    });

    it("battlecry-deals-four-damage-to-self", async () => {
        injuredBlademaster.play();
        await sleep();
        playerA.controller.selectTarget(0);
        await sleep();

        expect(playerA.board.cards).toContain(injuredBlademaster);
        expect(injuredBlademaster.role.health.current).toBe(3);
        expect(injuredBlademaster.role.health.maximum).toBe(7);
    });
});
