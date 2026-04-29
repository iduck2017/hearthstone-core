import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { WarriorModel } from "../../../heroes/warrior";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { ManaModel } from "../../../rules/mana";
import { WispModel } from "../wisp";
import { FieryWarAxeModel } from "../../warrior/fiery-war-axe";
import { SouthseaDeckhandModel } from "./index";
import { sleep } from "../../../utils/sleep";

describe('southsea-deckhand', () => {
    const app = new AppModel();

    const fieryWarAxe = new FieryWarAxeModel();
    const deckhand = new SouthseaDeckhandModel();
    const wispA = new WispModel();
    const wispB = new WispModel();

    const warrior = new WarriorModel();

    const game = new GameModel({
        playerA: new PlayerModel({
            hero: warrior,
            hand: new HandModel({ cards: [deckhand] }),
            mana: new ManaModel({ maximum: 10, current: 10 }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [wispA, wispB] }),
        }),
    });

    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });
    warrior.equipWeapon(fieryWarAxe);

    const playerA = game.playerA;
    const playerB = game.playerB;

    it('check-initial-state', () => {
        expect(playerA.hero.weapon).toBe(fieryWarAxe);
        expect(playerA.hand.cards).toContain(deckhand);
    });

    it('charge-active-on-summon-with-weapon', async () => {
        // Play deckhand from hand — finishSummon() calls sleep(), summoning sickness applies
        deckhand.play();
        await sleep();
        playerA.controller.selectTarget(0);
        await sleep();

        expect(playerA.board.minions).toContain(deckhand);
        // Weapon equipped → ChargeActiveDecor fires active() → charge overrides summoning sickness
        expect(deckhand.role.charge.isActived).toBe(true);
        expect(deckhand.role.isAttackEnabled).toBe(true);
    });

    it('charge-allows-attack-on-summon-turn', async () => {
        // Deckhand attacks opponent hero via Charge (Mage has 0 attack, deckhand survives)
        deckhand.role.runAttack();
        await sleep();
        playerA.controller.selectTarget(playerB.hero.role);
        await sleep();

        expect(playerB.hero.role.health.current).toBe(28);
    });

    it('charge-lost-when-weapon-is-destroyed', async () => {
        // First hero attack: durability 2 → 1
        warrior.role.runAttack();
        await sleep();
        playerA.controller.selectTarget(wispA.role);
        await sleep();
        expect(wispA.disposer.isActived).toBe(true);
        expect(fieryWarAxe.durability.current).toBe(1);

        // Second hero attack: durability 1 → 0, weapon destroyed
        warrior.role.action.resetCurrent();
        warrior.role.runAttack();
        await sleep();
        playerA.controller.selectTarget(wispB.role);
        await sleep();
        expect(wispB.disposer.isActived).toBe(true);
        expect(playerA.hero.weapon).toBeUndefined();

        // Charge deactivated — ChargeActiveDecor no longer fires active()
        expect(deckhand.role.charge.isActived).toBe(false);
        expect(deckhand.role.action.isAsleep).toBe(true);
    });
});
