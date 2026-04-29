import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { ManaModel } from "../../../rules/mana";
import { MageModel } from "../../../heroes/mage";
import { VoodooDoctorModel } from "./index";
import { InjuredBlademasterModel } from "../injured-blademaster/index";
import { sleep } from "../../../utils/sleep";

describe("voodoo-doctor", () => {
    const app = new AppModel();
    const voodooDoctor = new VoodooDoctorModel();
    const injuredBlademaster = new InjuredBlademasterModel();

    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            hand: new HandModel({ cards: [voodooDoctor] }),
            board: new BoardModel({ cards: [injuredBlademaster] }),
            mana: new ManaModel({ maximum: 1 }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
        }),
    });

    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    const playerA = game.playerA;

    // Simulate injured blademaster's self-damage battlecry effect: health 7 - 4 = 3
    injuredBlademaster.role.health['_current'] = 3;

    it("check-initial-state", () => {
        expect(playerA.hand.cards).toContain(voodooDoctor);
        expect(playerA.board.cards).toContain(injuredBlademaster);
        expect(injuredBlademaster.role.health.current).toBe(3);
        expect(injuredBlademaster.role.health.maximum).toBe(7);
    });

    it("battlecry-restores-two-health", async () => {
        voodooDoctor.launcher.run();
        await sleep();
        playerA.controller.selectTarget(0); // board position
        await sleep();
        playerA.controller.selectTarget(injuredBlademaster.role); // battlecry target
        await sleep();

        expect(playerA.board.cards).toContain(voodooDoctor);
        expect(injuredBlademaster.role.health.current).toBe(5);
        expect(injuredBlademaster.role.health.maximum).toBe(7);
    });
});
