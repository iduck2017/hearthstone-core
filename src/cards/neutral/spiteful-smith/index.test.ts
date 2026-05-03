import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { WarriorModel } from "../../../heroes/warrior";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { ManaModel } from "../../../rules/mana";
import { sleep } from "../../../utils/sleep";
import { SpitefulSmithModel } from "./index";
import { FieryWarAxeModel } from "../../warrior/fiery-war-axe";
import { WispModel } from "../wisp";
import { EarthenRingFarseerModel } from "../earthen-ring-farseer";
import { FireballModel } from "../../mage/fireball";

describe("spiteful-smith", () => {
    const app = new AppModel();
    const spitefulSmith = new SpitefulSmithModel();
    const weapon = new FieryWarAxeModel();
    const wisp = new WispModel();
    const earthenRingFarseer = new EarthenRingFarseerModel();
    const fireball = new FireballModel();

    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new WarriorModel(),
            board: new BoardModel({ cards: [spitefulSmith] }),
            hand: new HandModel({ cards: [weapon, earthenRingFarseer] }),
            mana: new ManaModel({ current: 10, maximum: 10 }),
        }),
        playerB: new PlayerModel({
            hero: new WarriorModel(),
            board: new BoardModel({ cards: [wisp] }),
            hand: new HandModel({ cards: [fireball] }),
            mana: new ManaModel({ current: 10, maximum: 10 }),
        }),
    });

    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    const playerA = game.playerA;
    const playerB = game.playerB;
    const hero = playerA.hero;

    it("equip-weapon", async () => {
        weapon.deployer.launch();
        await sleep();

        expect(hero.weapon).toBeTruthy();
        expect(hero.weapon?.attack.current).toBe(3);
    });

    it("no-buff-while-undamaged", () => {
        expect(spitefulSmith.role.health.current).toBe(6);
        expect(hero.weapon?.attack.current).toBe(3);
        expect(hero.role.attack.current).toBe(3);  // hero attack = weapon attack (no buff)
    });

    it("buff-applies-when-damaged", async () => {
        game.nextTurn();
        await sleep();

        wisp.role.action.launch();
        await sleep();
        playerB.controller.selectTarget(spitefulSmith.role);
        await sleep();

        expect(spitefulSmith.role.health.current).toBe(5);
        expect(hero.weapon?.attack.current).toBe(5);
    });

    it("buff-removed-when-healed", async () => {
        game.nextTurn();
        await sleep();

        earthenRingFarseer.deployer.launch();
        await sleep();
        playerA.controller.selectTarget(0);
        await sleep();
        playerA.controller.selectTarget(spitefulSmith.role);
        await sleep();

        expect(spitefulSmith.role.health.current).toBe(6);
        expect(hero.weapon?.attack.current).toBe(3);
        expect(hero.role.attack.current).toBe(3);  // hero attack = weapon attack (buff removed)
    });

    it("no-buff-after-spiteful-smith-dies", async () => {
        game.nextTurn();
        await sleep();

        fireball.deployer.launch();
        await sleep();
        playerB.controller.selectTarget(spitefulSmith.role);
        await sleep();

        expect(playerA.board.minions).not.toContain(spitefulSmith);
        expect(hero.weapon?.attack.current).toBe(3);

        game.nextTurn();
        expect(hero.role.attack.current).toBe(3)
    });
});
