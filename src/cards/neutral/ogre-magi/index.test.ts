import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { DeckModel } from "../../../entities/deck";
import { ManaModel } from "../../../rules/mana";
import { OgreMagiModel } from "./index";
import { FireballModel } from "../../mage/fireball";
import { BoulderfistOgreModel } from "../boulderfist-ogre";
import { sleep } from "../../../utils/sleep";

describe("ogre-magi", () => {
    const app = new AppModel();
    const ogreMagi = new OgreMagiModel();
    const fireball = new FireballModel();
    const boulderfistOgre = new BoulderfistOgreModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [ogreMagi] }),
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
        expect(playerA.board.cards).toContain(ogreMagi);
        expect(playerA.hand.cards).toContain(fireball);
        expect(playerB.board.cards).toContain(boulderfistOgre);
    });

    it("spell-damage-boosts-fireball", async () => {
        // Boulderfist Ogre has 7 HP: survives Fireball (6), dies to Spell Damage +1 Fireball (7)
        fireball.play();
        await sleep();
        playerA.controller.selectTarget(boulderfistOgre.role);
        await sleep();

        expect(boulderfistOgre.role.health.current).toBe(0)
        expect(boulderfistOgre.disposer.isActived).toBe(true);
        expect(playerB.board.cards.length).toBe(0);
    });
});
