import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { WispModel } from "../wisp";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { AngryChickenModel } from "./index";
import { ShatteredSunClericModel } from "../shattered-sun-cleric";
import { sleep } from "../../../utils/sleep";
import { MageModel } from "../../../heroes/mage";
import { ManaModel } from "../../../rules/mana";

describe("angry-chicken", () => {
    const app = new AppModel();
    const angryChicken = new AngryChickenModel();
    const shatteredSunCleric = new ShatteredSunClericModel();
    const wisp = new WispModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            hand: new HandModel({ cards: [shatteredSunCleric] }),
            board: new BoardModel({ cards: [angryChicken] }),
            mana: new ManaModel({ maximum: 5 }),
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

    it("check-initial-state", () => {
        expect(playerA.board.cards).toContain(angryChicken);
        expect(playerA.hand.cards).toContain(shatteredSunCleric);
        expect(playerB.board.cards).toContain(wisp);
    });

    it("enrage-gains-attack-while-damaged", async () => {
        shatteredSunCleric.deployer.launch();
        await sleep();
        playerA.controller.selectTarget(0);
        await sleep();
        playerA.controller.selectTarget(angryChicken.role);
        await sleep();

        game.nextTurn();
        await sleep();
        wisp.role.action.launch();
        await sleep();
        playerB.controller.selectTarget(angryChicken.role);
        await sleep();

        expect(angryChicken.role.health.current).toBe(1);
        expect(angryChicken.role.health.maximum).toBe(2);
        expect(angryChicken.role.attack.current).toBe(7);
    });
});
