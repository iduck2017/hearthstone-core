import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { WispModel } from "../wisp";
import { StranglethornTigerModel } from "./index";
import { sleep } from "../../../utils/sleep";

describe('stranglethorn-tiger', () => {
    const app = new AppModel();
    const wisp = new WispModel();
    const tiger = new StranglethornTigerModel();
    const freeTarget = new WispModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [wisp] }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [tiger, freeTarget] }),
        }),
    });
    const playerA = game.playerA;
    const playerB = game.playerB;
    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    it('check-initial-state', () => {
        expect(tiger.role.stealth.isActived).toBe(true);
        expect(wisp.role.action.isEnabled).toBe(true);
    });

    it('stealth-hides-from-attacker', async () => {
        wisp.role.action.launch();
        await sleep();
        const options = playerA.controller.selector?.options;
        // Tiger (stealthed) must not appear; freeTarget and hero must appear
        expect(options).not.toContain(tiger.role);
        expect(options).toContain(freeTarget.role);
        expect(options).toContain(playerB.hero.role);
        playerA.controller.selectTarget(freeTarget.role);
        await sleep();

        expect(wisp.disposer.isActived).toBe(true);
        expect(freeTarget.disposer.isActived).toBe(true);
    });

    it('stealth-removed-on-attack', async () => {
        game.nextTurn();
        await sleep();
        expect(tiger.role.stealth.isActived).toBe(true);
        tiger.role.action.launch();
        await sleep();
        playerB.controller.selectTarget(playerA.hero.role);
        await sleep();

        expect(tiger.role.stealth.isActived).toBe(false);
        expect(playerA.hero.role.health.current).toBe(25);
    });
});
