import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { ManaModel } from "../../../rules/mana";
import { MageModel } from "../../../heroes/mage";
import { sleep } from "../../../utils/sleep";
import { IronbeakOwlModel } from "./index";
import { SunwalkerModel } from "../sunwalker";

describe('ironbeak-owl', () => {
    const app = new AppModel();
    const ironbeakOwl = new IronbeakOwlModel();
    const sunwalker = new SunwalkerModel();

    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            hand: new HandModel({ cards: [ironbeakOwl] }),
            board: new BoardModel({ cards: [sunwalker] }),
            mana: new ManaModel({ maximum: 3 }),
        }),
        playerB: new PlayerModel({ hero: new MageModel() }),
    });

    const playerA = game.playerA;

    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    it('check-initial-state', () => {
        expect(sunwalker.role.taunt.isActived).toBe(true);
        expect(sunwalker.role.divineShield.isActived).toBe(true);
    });

    it('silence-sunwalker', async () => {
        ironbeakOwl.deployer.launch();
        await sleep();
        playerA.controller.selectTarget(1);
        await sleep();
        playerA.controller.selectTarget(sunwalker.role);
        await sleep();
        expect(sunwalker.role.taunt.isActived).toBe(false);
        expect(sunwalker.role.divineShield.isActived).toBe(false);
    });
});
