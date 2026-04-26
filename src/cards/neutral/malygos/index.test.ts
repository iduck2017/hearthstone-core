import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { DeckModel } from "../../../entities/deck";
import { ManaModel } from "../../../rules/mana";
import { MalygosModel } from "./index";
import { FireballModel } from "../../mage/fireball";
import { BoulderfistOgreModel } from "../boulderfist-ogre";
import { sleep } from "../../../utils/sleep";

describe("malygos", () => {
    const app = new AppModel();
    const malygos = new MalygosModel();
    const fireball = new FireballModel();
    // Boulderfist Ogre has 7 HP: survives Fireball alone (6 < 7), dies to Spell Damage +5 (11 > 7)
    const boulderfistOgre = new BoulderfistOgreModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [malygos] }),
            hand: new HandModel({ cards: [fireball] }),
            deck: new DeckModel(),
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
        expect(playerA.board.cards).toContain(malygos);
        expect(playerA.hand.cards).toContain(fireball);
        expect(playerB.board.cards).toContain(boulderfistOgre);
    });

    it("spell-damage-plus-five-boosts-fireball", async () => {
        // Without Malygos: Fireball deals 6 → Ogre survives (7 HP)
        // With Malygos Spell Damage +5: Fireball deals 11 → Ogre dies
        fireball.play();
        await sleep();
        playerA.controller.selectTarget(boulderfistOgre.role);
        await sleep();

        expect(boulderfistOgre.disposer.isActived).toBe(true);
        expect(playerB.board.cards.length).toBe(0);
    });
});
