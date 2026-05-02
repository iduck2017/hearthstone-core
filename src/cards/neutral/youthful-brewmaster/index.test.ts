import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { ManaModel } from "../../../rules/mana";
import { MageModel } from "../../../heroes/mage";
import { sleep } from "../../../utils/sleep";
import { YouthfulBrewmasterModel } from "./index";
import { WispModel } from "../wisp";

describe('youthful-brewmaster', () => {
    const app = new AppModel();
    const brewmaster = new YouthfulBrewmasterModel();
    const wisp = new WispModel();

    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            hand: new HandModel({ cards: [brewmaster] }),
            board: new BoardModel({ cards: [wisp] }),
            mana: new ManaModel({ maximum: 2 }),
        }),
        playerB: new PlayerModel({ hero: new MageModel() }),
    });

    const playerA = game.playerA;

    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    it('check-initial-state', () => {
        expect(playerA.board.minions).toContain(wisp);
        expect(playerA.hand.cards).toContain(brewmaster);
    });

    it('bounce-wisp', async () => {
        brewmaster.deployer.launch();
        await sleep();
        playerA.controller.selectTarget(0);
        await sleep();
        playerA.controller.selectTarget(wisp.role);
        await sleep();
        expect(playerA.board.minions).toContain(brewmaster);
        expect(playerA.board.minions).not.toContain(wisp);
        expect(playerA.hand.cards).toContain(wisp);
    });
});
