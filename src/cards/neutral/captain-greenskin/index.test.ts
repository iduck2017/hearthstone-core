import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { WarriorModel } from "../../../heroes/warrior";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { ManaModel } from "../../../rules/mana";
import { sleep } from "../../../utils/sleep";
import { CaptainGreenskinModel } from "./index";
import { FieryWarAxeModel } from "../../warrior/fiery-war-axe";

describe("captain-greenskin", () => {
    const app = new AppModel();
    const captainGreenskin = new CaptainGreenskinModel();
    const weapon1 = new FieryWarAxeModel();
    const weapon2 = new FieryWarAxeModel();

    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new WarriorModel(),
            board: new BoardModel({ cards: [] }),
            hand: new HandModel({ cards: [weapon1, captainGreenskin, weapon2] }),
            mana: new ManaModel({ current: 10, maximum: 10 }),
        }),
        playerB: new PlayerModel({
            hero: new WarriorModel(),
            board: new BoardModel({ cards: [] }),
            hand: new HandModel({ cards: [] }),
            mana: new ManaModel({ current: 10, maximum: 10 }),
        }),
    });

    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    const playerA = game.playerA;
    const hero = playerA.hero;

    it("battlecry-buffs-weapon", async () => {
        weapon1.deployer.launch();
        await sleep();

        captainGreenskin.deployer.launch();
        await sleep();
        playerA.controller.selectTarget(0);
        await sleep();

        expect(hero.weapon?.attack.current).toBe(4);
        expect(hero.weapon?.durability.current).toBe(3);
        expect(hero.role.attack.current).toBe(4);
    });

    it("new-weapon-has-no-buff", async () => {
        weapon2.deployer.launch();
        await sleep();

        expect(hero.weapon).not.toBe(weapon1);
        expect(hero.weapon?.attack.current).toBe(3);
        expect(hero.weapon?.durability.current).toBe(2);
        expect(hero.role.attack.current).toBe(3);
    });
});
