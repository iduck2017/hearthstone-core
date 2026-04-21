import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { DeckModel } from "../../../entities/deck";
import { WispModel } from "../wisp";
import { ElvenArcherModel } from "../elven-archer";
import { AcolyteOfPainModel } from "./index";
import { sleep } from "../../../utils/sleep";

describe("acolyte-of-pain", () => {
    const app = new AppModel();
    const acolyteOfPain = new AcolyteOfPainModel();
    const deckWisp = new WispModel();
    const deckWispB = new WispModel();
    const wisp = new WispModel();
    const elvenArcher = new ElvenArcherModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [acolyteOfPain] }),
            deck: new DeckModel({ cards: [deckWisp, deckWispB] }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [wisp] }),
            hand: new HandModel({ cards: [elvenArcher] }),
        }),
    });

    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    const playerA = game.playerA;
    const playerB = game.playerB;

    it("check-initial-state", () => {
        expect(playerA.board.cards).toContain(acolyteOfPain);
        expect(playerA.hand.cards.length).toBe(0);
        expect(playerA.deck.cards.length).toBe(2);
        expect(playerB.board.cards).toContain(wisp);
        expect(playerB.hand.cards).toContain(elvenArcher);
    });

    it("combat-hit-draws-a-card", async () => {
        game.nextTurn();
        await sleep();

        wisp.role.runAttack();
        await sleep();
        playerB.controller.selectTarget(acolyteOfPain.role);
        await sleep();

        expect(acolyteOfPain.role.health.current).toBe(2);
        expect(playerA.hand.cards.length).toBe(1);
    });

    it("battlecry-hit-draws-another-card", async () => {
        elvenArcher.play();
        await sleep();
        playerB.controller.selectTarget(0);
        await sleep();
        playerB.controller.selectTarget(acolyteOfPain.role);
        await sleep();

        expect(acolyteOfPain.role.health.current).toBe(1);
        expect(playerA.hand.cards.length).toBe(2);
    });
});
