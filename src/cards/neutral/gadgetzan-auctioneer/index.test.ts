import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { DeckModel } from "../../../entities/deck";
import { ManaModel } from "../../../rules/mana";
import { GadgetzanAuctioneerModel } from "./index";
import { FireballModel } from "../../mage/fireball";
import { WispModel } from "../wisp";
import { sleep } from "../../../utils/sleep";

describe("gadgetzan-auctioneer", () => {
    const app = new AppModel();
    const auctioneer = new GadgetzanAuctioneerModel();
    const fireball = new FireballModel();
    const deckWisp = new WispModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [auctioneer] }),
            hand: new HandModel({ cards: [fireball] }),
            deck: new DeckModel({ cards: [deckWisp] }),
            mana: new ManaModel({ current: 10, maximum: 10 }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
        }),
    });

    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    const playerA = game.playerA;
    const playerB = game.playerB;

    it("check-initial-state", () => {
        expect(playerA.board.cards).toContain(auctioneer);
        expect(playerA.hand.cards).toContain(fireball);
        expect(playerA.deck.cards).toContain(deckWisp);
    });

    it("spell-triggers-draw", async () => {
        fireball.deployer.launch();
        await sleep();
        playerA.controller.selectTarget(playerB.hero.role);
        await sleep();
        expect(playerA.hand.cards).toContain(deckWisp);
        expect(playerA.deck.cards.length).toBe(0);
    });
});
