import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { DeckModel } from "../../../entities/deck";
import { ManaModel } from "../../../rules/mana";
import { KoboldGeomancerModel } from "./index";
import { FireballModel } from "../../mage/fireball";
import { BoulderfistOgreModel } from "../boulderfist-ogre";
import { sleep } from "../../../utils/sleep";

describe("kobold-geomancer", () => {
    const app = new AppModel();
    const koboldGeomancer = new KoboldGeomancerModel();
    const fireball = new FireballModel();
    const boulderfistOgre = new BoulderfistOgreModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [koboldGeomancer] }),
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
        expect(playerA.board.cards).toContain(koboldGeomancer);
        expect(playerA.hand.cards).toContain(fireball);
        expect(playerB.board.cards).toContain(boulderfistOgre);
    });

    it("spell-damage-boosts-fireball", async () => {
        // Boulderfist Ogre has 7 HP: survives 6 damage (Fireball), dies to 7 (Spell Damage +1)
        fireball.launcher.run();
        await sleep();
        playerA.controller.selectTarget(boulderfistOgre.role);
        await sleep();

        expect(boulderfistOgre.disposer.isActived).toBe(true);
        expect(playerB.board.cards.length).toBe(0);
    });
});
