import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { DeckModel } from "../../../entities/deck";
import { ManaModel } from "../../../rules/mana";
import { BloodmageThalnossModel } from "./index";
import { WispModel } from "../wisp";
import { BoulderfistOgreModel } from "../boulderfist-ogre";
import { FireballModel } from "../../mage/fireball";
import { sleep } from "../../../utils/sleep";

describe("bloodmage-thalnos", () => {
    const app = new AppModel();
    const bloodmageThalnos = new BloodmageThalnossModel();
    const fireball = new FireballModel();
    const deckWisp = new WispModel();
    const boulderfistOgre = new BoulderfistOgreModel();
    // enemyWisp kills Thalnos (1 hp) to trigger deathrattle
    const enemyWisp = new WispModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [bloodmageThalnos] }),
            hand: new HandModel({ cards: [fireball] }),
            deck: new DeckModel({ cards: [deckWisp] }),
            mana: new ManaModel({ maximum: 10, current: 10 }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [boulderfistOgre, enemyWisp] }),
        }),
    });
    const playerA = game.playerA;
    const playerB = game.playerB;
    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    it("check-initial-state", () => {
        expect(playerA.board.cards).toContain(bloodmageThalnos);
        expect(playerA.hand.cards).toContain(fireball);
        expect(playerA.deck.cards).toContain(deckWisp);
        expect(playerB.board.cards).toContain(boulderfistOgre);
    });

    it("spell-damage-boosts-fireball", async () => {
        // Fireball with Spell Damage +1 deals 7 damage; Boulderfist Ogre has 7 HP → dies
        fireball.deployer.launch();
        await sleep();
        playerA.controller.selectTarget(boulderfistOgre.role);
        await sleep();

        expect(boulderfistOgre.disposer.isActived).toBe(true);
        expect(playerB.board.cards).not.toContain(boulderfistOgre);
    });

    it("deathrattle-draws-card-on-death", async () => {
        // Thalnos (1 atk) attacks enemyWisp (1 hp) → both die; deathrattle draws deckWisp
        bloodmageThalnos.role.action.launch();
        await sleep();
        playerA.controller.selectTarget(enemyWisp.role);
        await sleep();

        expect(bloodmageThalnos.disposer.isActived).toBe(true);
        expect(playerA.hand.cards).toContain(deckWisp);
        expect(playerA.deck.cards.length).toBe(0);
    });
});
