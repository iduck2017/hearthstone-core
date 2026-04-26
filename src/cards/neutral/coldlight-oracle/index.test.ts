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
    const deckWisp1 = new WispModel();
    const deckWisp2 = new WispModel();
    const deckRaptor1 = new BloodfenRaptorModel();
    const deckRaptor2 = new BloodfenRaptorModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel(),
            hand: new HandModel({ cards: [coldlightOracle] }),
            deck: new DeckModel({ cards: [deckWisp1, deckWisp2] }),
            mana: new ManaModel({ maximum: 10, current: 10 }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel(),
            deck: new DeckModel({ cards: [deckRaptor1, deckRaptor2] }),
        }),
    });
    const playerA = game.playerA;
    const playerB = game.playerB;
    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    it("check-initial-state", () => {
        expect(playerA.hand.cards).toContain(coldlightOracle);
        expect(playerA.deck.cards).toContain(deckWisp1);
        expect(playerA.deck.cards).toContain(deckWisp2);
        expect(playerB.deck.cards).toContain(deckRaptor1);
        expect(playerB.deck.cards).toContain(deckRaptor2);
    });

    it("battlecry-both-players-draw-two", async () => {
        // Play Coldlight Oracle; battlecry draws 2 for each player
        coldlightOracle.play();
        await sleep();
        playerA.controller.selectTarget(0); // select board position
        await sleep();

        expect(playerA.hand.cards).toContain(deckWisp1);
        expect(playerA.hand.cards).toContain(deckWisp2);
        expect(playerA.deck.cards.length).toBe(0);
        expect(playerB.hand.cards).toContain(deckRaptor1);
        expect(playerB.hand.cards).toContain(deckRaptor2);
        expect(playerB.deck.cards.length).toBe(0);
    });
});
