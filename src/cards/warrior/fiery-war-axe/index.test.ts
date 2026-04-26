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
    const wisp1 = new WispModel();
    const wisp2 = new WispModel();

    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new WarriorModel(),
            hand: new HandModel({ cards: [fieryWarAxe] }),
            mana: new ManaModel({ maximum: 10, current: 10 }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [wisp1, wisp2] }),
        }),
    });

    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    const playerA = game.playerA;
    const hero = playerA.hero;

    it('check-initial-state', () => {
        expect(playerA.hand.cards).toContain(fieryWarAxe);
        expect(playerA.weapon).toBeUndefined();
        expect(hero.role.attack.current).toBe(0);
    });

    it('equip-weapon-on-play', async () => {
        await fieryWarAxe.play();

        expect(playerA.weapon).toBe(fieryWarAxe);
        expect(hero.role.attack.current).toBe(3);
        expect(fieryWarAxe.durability.current).toBe(2);
        expect(playerA.hand.cards).not.toContain(fieryWarAxe);
    });

    it('weapon-breaks-after-two-attacks', async () => {
        // First hero attack: durability 2 → 1
        hero.role.runAttack();
        await sleep();
        playerA.controller.selectTarget(wisp1.role);
        await sleep();

        expect(fieryWarAxe.durability.current).toBe(1);
        expect(playerA.weapon).toBe(fieryWarAxe);

        // Second hero attack: durability 1 → 0, weapon destroyed
        hero.role.action.resetCurrent();
        hero.role.runAttack();
        await sleep();
        playerA.controller.selectTarget(wisp2.role);
        await sleep();
        expect(playerA.weapon).toBeUndefined();
        expect(playerA.graveyard.cards).toContain(fieryWarAxe);
    });
});
