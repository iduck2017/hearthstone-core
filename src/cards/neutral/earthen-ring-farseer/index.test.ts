import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { ManaModel } from "../../../rules/mana";
import { MageModel } from "../../../heroes/mage";
import { EarthenRingFarseerModel } from "./index";
import { InjuredBlademasterModel } from "../injured-blademaster/index";
import { sleep } from "../../../utils/sleep";

describe("earthen-ring-farseer", () => {
    const app = new AppModel();
    const farseer = new EarthenRingFarseerModel();
    const injuredBlademaster = new InjuredBlademasterModel();

    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            hand: new HandModel({ cards: [farseer] }),
            board: new BoardModel({ cards: [injuredBlademaster] }),
            mana: new ManaModel({ maximum: 3 }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
        }),
    });

    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    const playerA = game.playerA;

    // injuredBlademaster enters as 4/3 (7 - 4 = 3 current health)
    injuredBlademaster.role.health['_current'] = 3;

    it("check-initial-state", () => {
        expect(playerA.hand.cards).toContain(farseer);
        expect(playerA.board.cards).toContain(injuredBlademaster);
        expect(injuredBlademaster.role.health.current).toBe(3);
    });

    it("battlecry-restores-three-health", async () => {
        farseer.play();
        await sleep();
        playerA.controller.selectTarget(1); // board position after injuredBlademaster
        await sleep();
        playerA.controller.selectTarget(injuredBlademaster.role);
        await sleep();

        expect(playerA.board.cards).toContain(farseer);
        expect(injuredBlademaster.role.health.current).toBe(6);
        expect(injuredBlademaster.role.health.maximum).toBe(7);
    });
});
