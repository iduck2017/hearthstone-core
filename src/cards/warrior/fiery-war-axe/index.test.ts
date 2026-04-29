import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { WarriorModel } from "../../../heroes/warrior";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { ManaModel } from "../../../rules/mana";
import { WispModel } from "../../neutral/wisp";
import { MageModel } from "../../../heroes/mage";
import { FieryWarAxeModel } from "./index";
import { sleep } from "../../../utils/sleep";

describe('fiery-war-axe', () => {
    const app = new AppModel();

    const fieryWarAxe = new FieryWarAxeModel();
    const wispA = new WispModel();
    const wispB = new WispModel();

    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new WarriorModel(),
            hand: new HandModel({ cards: [fieryWarAxe] }),
            mana: new ManaModel({ maximum: 10, current: 10 }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [wispA, wispB] }),
        }),
    });

    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    const playerA = game.playerA;
    const heroA = playerA.hero;

    it('check-initial-state', () => {
        expect(playerA.hand.cards).toContain(fieryWarAxe);
        expect(heroA.weapon).toBeUndefined();
        expect(heroA.role.attack.current).toBe(0);
    });

    it('equip-weapon-on-play', async () => {
        await fieryWarAxe.play();

        expect(heroA.weapon).toBe(fieryWarAxe);
        expect(heroA.role.attack.current).toBe(3);
        expect(fieryWarAxe.durability.current).toBe(2);
        expect(playerA.hand.cards).not.toContain(fieryWarAxe);
    });

    it('weapon-breaks-after-two-attacks', async () => {
        // First hero attack: durability 2 → 1
        heroA.role.runAttack();
        await sleep();
        playerA.controller.selectTarget(wispA.role);
        await sleep();

        expect(fieryWarAxe.durability.current).toBe(1);
        expect(heroA.weapon).toBe(fieryWarAxe);

        // Second hero attack: durability 1 → 0, weapon destroyed
        heroA.role.action.resetCurrent();
        heroA.role.runAttack();
        await sleep();
        playerA.controller.selectTarget(wispB.role);
        await sleep();
        expect(heroA.weapon).toBeUndefined();
        expect(playerA.graveyard.cards).toContain(fieryWarAxe);
    });
});
