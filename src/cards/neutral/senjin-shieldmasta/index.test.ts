import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { WispModel } from "../wisp";
import { SenjinShieldmastaModel } from "./index";
import { sleep } from "../../../utils/sleep";

describe('senjin-shieldmasta', () => {
    const app = new AppModel();
    const wisp = new WispModel();
    const shieldmasta = new SenjinShieldmastaModel();
    const freeTarget = new WispModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [wisp] }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [shieldmasta, freeTarget] }),
        }),
    });
    const playerA = game.playerA;
    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    it('check-initial-state', () => {
        expect(shieldmasta.role.taunt.isActived).toBe(true);
        expect(freeTarget.role.taunt.isActived).toBe(false);
        expect(wisp.role.action.isEnabled).toBe(true);
    });

    it('taunt-forces-attacker-to-target-shieldmasta', async () => {
        wisp.role.action.launch();
        await sleep();
        const options = playerA.controller.selector?.options;
        // Only taunt targets are selectable
        expect(options).toContain(shieldmasta.role);
        expect(options).not.toContain(freeTarget.role);
        expect(options).not.toContain(playerA.hero.role);
        playerA.controller.selectTarget(shieldmasta.role);
        await sleep();

        // Wisp (1/1) vs Shieldmasta (3/5): wisp dies, shieldmasta takes 1 damage
        expect(wisp.disposer.isActived).toBe(true);
        expect(shieldmasta.role.health.current).toBe(4);
        expect(shieldmasta.disposer.isActived).toBe(false);
    });
});
