import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { ManaModel } from "../../../rules/mana";
import { MageModel } from "../../../heroes/mage";
import { sleep } from "../../../utils/sleep";
import { SpellbreakerModel } from "./index";
import { ShatteredSunClericModel } from "../shattered-sun-cleric";
import { SunwalkerModel } from "../sunwalker";

describe('spellbreaker', () => {
    const app = new AppModel();
    const spellbreaker = new SpellbreakerModel();
    const shatteredSunCleric = new ShatteredSunClericModel();
    const sunwalker = new SunwalkerModel();

    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            hand: new HandModel({ cards: [shatteredSunCleric, spellbreaker] }),
            board: new BoardModel({ cards: [sunwalker] }),
            mana: new ManaModel({ maximum: 7 }),
        }),
        playerB: new PlayerModel({ hero: new MageModel() }),
    });

    const playerA = game.playerA;

    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    it('check-initial-state', () => {
        expect(sunwalker.role.attack.current).toBe(4);
        expect(sunwalker.role.health.maximum).toBe(5);
        expect(sunwalker.role.taunt.isActived).toBe(true);
        expect(sunwalker.role.divineShield.isActived).toBe(true);
    });

    it('buff-sunwalker', async () => {
        shatteredSunCleric.deployer.launch();
        await sleep();
        playerA.controller.selectTarget(1);
        await sleep();
        playerA.controller.selectTarget(sunwalker.role);
        await sleep();
        expect(sunwalker.role.attack.current).toBe(5);
        expect(sunwalker.role.health.maximum).toBe(6);
    });

    it('silence-sunwalker', async () => {
        spellbreaker.deployer.launch();
        await sleep();
        playerA.controller.selectTarget(2);
        await sleep();
        playerA.controller.selectTarget(sunwalker.role);
        await sleep();
        expect(sunwalker.role.taunt.isActived).toBe(false);
        expect(sunwalker.role.divineShield.isActived).toBe(false);
        expect(sunwalker.role.attack.current).toBe(4);
        expect(sunwalker.role.health.maximum).toBe(5);
    });
});
