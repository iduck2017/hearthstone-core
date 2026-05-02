import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { WispModel } from "../wisp";
import { ScarletCrusaderModel } from "./index";
import { sleep } from "../../../utils/sleep";

describe('scarlet-crusader', () => {
    const app = new AppModel();
    const wispA = new WispModel();
    const wispB = new WispModel();
    const crusader = new ScarletCrusaderModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [wispA, wispB] }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [crusader] }),
        }),
    });
    const playerA = game.playerA;
    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    it('check-initial-state', () => {
        expect(crusader.role.divineShield.isActived).toBe(true);
        expect(crusader.role.health.current).toBe(1);
    });

    it('divine-shield-absorbs-first-hit', async () => {
        wispA.role.action.launch();
        await sleep();
        playerA.controller.selectTarget(crusader.role);
        await sleep();

        // Shield absorbs all damage; crusader survives at full health
        expect(crusader.role.divineShield.isActived).toBe(false);
        expect(crusader.role.health.current).toBe(1);
        expect(crusader.disposer.isActived).toBe(false);
        // wispA took 3 damage from crusader's counter-attack and died
        expect(wispA.disposer.isActived).toBe(true);
    });

    it('dies-after-shield-broken', async () => {
        wispB.role.action.launch();
        await sleep();
        playerA.controller.selectTarget(crusader.role);
        await sleep();

        expect(crusader.role.health.current).toBe(0);
        expect(crusader.disposer.isActived).toBe(true);
    });
});
