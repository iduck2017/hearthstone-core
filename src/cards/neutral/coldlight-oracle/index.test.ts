import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { DeckModel } from "../../../entities/deck";
import { ManaModel } from "../../../rules/mana";
import { ColdlightOracleModel } from "./index";
import { WispModel } from "../wisp";
import { BloodfenRaptorModel } from "../bloodfen-raptor";
import { sleep } from "../../../utils/sleep";

describe("coldlight-oracle", () => {
    const app = new AppModel();
    const coldlightOracle = new ColdlightOracleModel();
    const deckWispA = new WispModel();
    const deckWispB = new WispModel();
    const deckRaptorA = new BloodfenRaptorModel();
    const deckRaptorB = new BloodfenRaptorModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel(),
            hand: new HandModel({ cards: [coldlightOracle] }),
            deck: new DeckModel({ cards: [deckWispA, deckWispB] }),
            mana: new ManaModel({ maximum: 10, current: 10 }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel(),
            deck: new DeckModel({ cards: [deckRaptorA, deckRaptorB] }),
        }),
    });
    const playerA = game.playerA;
    const playerB = game.playerB;
    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    it("check-initial-state", () => {
        expect(playerA.hand.cards).toContain(coldlightOracle);
        expect(playerA.deck.cards).toContain(deckWispA);
        expect(playerA.deck.cards).toContain(deckWispB);
        expect(playerB.deck.cards).toContain(deckRaptorA);
        expect(playerB.deck.cards).toContain(deckRaptorB);
    });

    it("battlecry-both-players-draw-two", async () => {
        // Play Coldlight Oracle; battlecry draws 2 for each player
        coldlightOracle.play();
        await sleep();
        playerA.controller.selectTarget(0); // select board position
        await sleep();

        expect(playerA.hand.cards).toContain(deckWispA);
        expect(playerA.hand.cards).toContain(deckWispB);
        expect(playerA.deck.cards.length).toBe(0);
        expect(playerB.hand.cards).toContain(deckRaptorA);
        expect(playerB.hand.cards).toContain(deckRaptorB);
        expect(playerB.deck.cards.length).toBe(0);
    });
});
