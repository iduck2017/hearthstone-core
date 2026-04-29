import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { DeckModel } from "../../../entities/deck";
import { ManaModel } from "../../../rules/mana";
import { AzureDrakeModel } from "./index";
import { FireballModel } from "../../mage/fireball";
import { BoulderfistOgreModel } from "../boulderfist-ogre";
import { WispModel } from "../wisp";
import { sleep } from "../../../utils/sleep";

describe("azure-drake", () => {
    const app = new AppModel();
    const azureDrake = new AzureDrakeModel();
    const fireball = new FireballModel();
    const deckWisp = new WispModel();
    const boulderfistOgre = new BoulderfistOgreModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel(),
            hand: new HandModel({ cards: [azureDrake, fireball] }),
            deck: new DeckModel({ cards: [deckWisp] }),
            mana: new ManaModel({ maximum: 10, current: 10 }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [boulderfistOgre] }),
        }),
    });
    const playerA = game.playerA;
    const playerB = game.playerB;
    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    it("check-initial-state", () => {
        expect(playerA.hand.cards).toContain(azureDrake);
        expect(playerA.hand.cards).toContain(fireball);
        expect(playerA.deck.cards).toContain(deckWisp);
        expect(playerB.board.cards).toContain(boulderfistOgre);
    });

    it("battlecry-draws-card-and-spell-damage-boosts-fireball", async () => {
        // Play Azure Drake: select board position, battlecry draws deckWisp
        azureDrake.launcher.run();
        await sleep();
        playerA.controller.selectTarget(0);
        await sleep();

        expect(playerA.board.cards).toContain(azureDrake);
        expect(playerA.hand.cards).toContain(deckWisp);
        expect(playerA.deck.cards.length).toBe(0);

        // Play Fireball with Spell Damage +1 from Azure Drake (on board)
        // Boulderfist Ogre has 7 HP: survives Fireball (6), dies to 7 damage
        fireball.launcher.run();
        await sleep();
        playerA.controller.selectTarget(boulderfistOgre.role);
        await sleep();

        expect(boulderfistOgre.disposer.isActived).toBe(true);
        expect(playerB.board.cards.length).toBe(0);
    });
});
