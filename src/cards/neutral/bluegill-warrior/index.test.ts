import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { WispModel } from "../wisp";
import { BluegillWarriorModel } from "./index";
import { sleep } from "../../../utils/sleep";

describe('bluegill-warrior', () => {
    const app = new AppModel();
    const bluegill = new BluegillWarriorModel();
    const wisp = new WispModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [bluegill] }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [wisp] }),
        }),
    });
    const playerA = game.playerA;
    const playerB = game.playerB;
    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    it('check-initial-state', () => {
        expect(bluegill.role.charge.isActived).toBe(true);
        // Charge grants attack right on the summon turn
        expect(bluegill.role.action.isEnabled).toBe(true);
    });

    it('charge-can-attack-hero-on-summon-turn', async () => {
        bluegill.role.action.launch();
        await sleep();
        // Selector must include the opponent's hero (Charge bypasses summon-turn restriction)
        const options = playerA.controller.selector?.options;
        expect(options).toContain(playerB.hero.role);
        playerA.controller.selectTarget(playerB.hero.role);
        await sleep();

        // Hero takes 2 damage; bluegill takes none (hero has 0 attack)
        expect(playerB.hero.role.health.current).toBe(28);
        expect(bluegill.role.health.current).toBe(1);
        // Action consumed — cannot attack again this turn
        expect(bluegill.role.action.current).toBe(0);
    });
});
