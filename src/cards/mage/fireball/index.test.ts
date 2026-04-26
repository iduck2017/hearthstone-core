import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { DeckModel } from "../../../entities/deck";
import { ManaModel } from "../../../rules/mana";
import { FireballModel } from "./index";
import { ChillwindYetiModel } from "../../neutral/chillwind-yeti";
import { sleep } from "../../../utils/sleep";

describe("fireball", () => {
    const app = new AppModel();
    const fireball = new FireballModel();
    const yeti = new ChillwindYetiModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            hand: new HandModel({ cards: [fireball] }),
            board: new BoardModel(),
            deck: new DeckModel(),
            mana: new ManaModel({ maximum: 10, current: 10 }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [yeti] }),
        }),
    });
    const playerA = game.playerA;
    const playerB = game.playerB;
    app.setGame(game);
    game.start();

    it("check-initial-state", () => {
        expect(playerA.hand.cards).toContain(fireball);
        expect(playerB.board.cards).toContain(yeti);
    });

    it("fireball-kills-target-and-enters-graveyard", async () => {
        fireball.play();
        await sleep();
        const options = playerA.controller.selector?.options;
        expect(options).toContain(yeti.role);
        playerA.controller.selectTarget(yeti.role);
        await sleep();

        expect(yeti.disposer.isActived).toBe(true);
        expect(playerB.board.cards.length).toBe(0);
        expect(playerA.graveyard.cards).toContain(fireball);
        expect(playerA.mana.current).toBe(playerA.mana.maximum - 4);
    });
});
