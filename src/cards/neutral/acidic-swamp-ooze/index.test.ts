import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { HandModel } from "../../../entities/hand";
import { ManaModel } from "../../../rules/mana";
import { AcidicSwampOozeModel } from "./index";
import { FieryWarAxeModel } from "../../warrior/fiery-war-axe";

describe('acidic-swamp-ooze', () => {
    const app = new AppModel();

    const fieryWarAxe = new FieryWarAxeModel();
    const ooze = new AcidicSwampOozeModel();

    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            hand: new HandModel({ cards: [ooze] }),
            mana: new ManaModel({ maximum: 10, current: 10 }),
        }),
    });

    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    const playerA = game.playerA;
    const playerB = game.playerB;

    // Equip weapon on playerA's hero
    playerA.hero.equipWeapon(fieryWarAxe);

    // Switch to playerB's turn so ooze is playable
    game.nextTurn();

    it('check-initial-state', () => {
        expect(playerA.hero.weapon).toBe(fieryWarAxe);
        expect(fieryWarAxe.durability.current).toBe(2);
    });

    it('battlecry-destroys-opponent-weapon', async () => {
        const promise = ooze.deployer.launch();
        playerB.controller.selectTarget(0); // board position
        await promise;
        expect(playerA.hero.weapon).toBeUndefined();
        expect(playerA.graveyard.cards).toContain(fieryWarAxe);
    });
});
