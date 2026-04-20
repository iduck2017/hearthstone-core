
import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { HarvestGolemModel } from "./index";
import { DamagedGolemModel } from "../../derivatives/damaged-golem";
import { BloodfenRaptorModel } from "../bloodfen-raptor";
import { sleep } from "../../../utils/sleep";

describe('harvest-golem', () => {
    const app = new AppModel();
    const harvestGolem = new HarvestGolemModel();
    const bloodfenRaptor = new BloodfenRaptorModel();

    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({
                cards: [harvestGolem],
            }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({
                cards: [bloodfenRaptor],
            }),
        }),
    });

    app.setGame(game);
    game.start({
        isInitPhaseIgnored: true,
    });

    const playerA = game.playerA;
    const playerB = game.playerB;

    it('check-initial-state', () => {
        expect(playerA.board.cards).toContain(harvestGolem);
        expect(playerB.board.cards).toContain(bloodfenRaptor);
    });

    it('deathrattle-summon-damaged-golem-on-death', async () => {
        harvestGolem.role.runAttack();
        await sleep();
        playerA.controller.selectTarget(bloodfenRaptor.role);
        await sleep();

        expect(harvestGolem.disposer.isActived).toBe(true);
        expect(playerA.board.minions.length).toBe(1);
        const token = playerA.board.minions[0];
        expect(token).toBeInstanceOf(DamagedGolemModel);
        expect(token?.role.attack.current).toBe(2);
        expect(token?.role.health.current).toBe(1);
    });
});
