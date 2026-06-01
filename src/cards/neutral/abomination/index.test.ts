import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { ManaModel } from "../../../rules/mana";
import { WispModel } from "../wisp";
import { AbominationModel } from "./index";
import { FireballModel } from "../../mage/fireball";
import { sleep } from "../../../utils/sleep";

describe("abomination", () => {
    const app = new AppModel();
    const abominationA = new AbominationModel();
    const wispA = new WispModel();
    const fireball = new FireballModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [abominationA, wispA] }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            hand: new HandModel({ cards: [fireball] }),
            mana: new ManaModel({ maximum: 10 }),
        }),
    });

    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    const playerA = game.playerA;
    const playerB = game.playerB;

    it("check-initial-state", () => {
        expect(playerA.board.cards).toContain(abominationA);
        expect(playerA.board.cards).toContain(wispA);
        expect(playerB.hand.cards).toContain(fireball);
        expect(abominationA.role.taunt.isActived).toBe(true);
        expect(abominationA.role.health.current).toBe(4);
        expect(playerA.hero.role.health.current).toBe(30);
        expect(playerB.hero.role.health.current).toBe(30);
    });

    it("deathrattle-deals-damage-to-all", async () => {
        game.nextTurn();
        await sleep();
        fireball.deployer.launch();
        await sleep();
        const options = playerB.controller.selector?.options;
        expect(options).toContain(abominationA.role);
        playerB.controller.selectTarget(abominationA.role);
        await sleep();
        expect(abominationA.disposer.isActived).toBe(true);
        expect(wispA.disposer.isActived).toBe(true);
        expect(playerA.hero.role.health.current).toBe(28);
        expect(playerB.hero.role.health.current).toBe(28);
    });
});
