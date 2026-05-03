import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { ManaModel } from "../../../rules/mana";
import { sleep } from "../../../utils/sleep";
import { ArcaneGolemModel } from "./index";
import { WispModel } from "../wisp";

describe("arcane-golem", () => {
    const app = new AppModel();
    const arcaneGolem = new ArcaneGolemModel();
    const wisp = new WispModel();

    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [] }),
            hand: new HandModel({ cards: [arcaneGolem] }),
            mana: new ManaModel({ current: 10, maximum: 10 }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [wisp] }),
            hand: new HandModel({ cards: [] }),
            mana: new ManaModel({ current: 3, maximum: 7 }),
        }),
    });

    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    const playerA = game.playerA;
    const playerB = game.playerB;

    it("battlecry-gives-opponent-mana-crystal", async () => {
        arcaneGolem.deployer.launch();
        await sleep();
        playerA.controller.selectTarget(0);
        await sleep();

        expect(playerB.mana.maximum).toBe(8);
        expect(playerB.mana.current).toBe(4);
    });

    it("charge-allows-immediate-attack", async () => {
        arcaneGolem.role.action.launch();
        await sleep();
        playerA.controller.selectTarget(wisp.role);
        await sleep();

        expect(wisp.disposer.isActived).toBe(true);
        expect(arcaneGolem.role.health.current).toBe(1);
    });
});
