import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { MageModel } from "../../../heroes/mage";
import { sleep } from "../../../utils/sleep";
import { ManaModel } from "../../../rules/mana";
import { FrostElementalModel } from "./index";
import { BluegillWarriorModel } from "../bluegill-warrior";

describe('frost-elemental', () => {
    const app = new AppModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            hand: new HandModel({
                cards: [new FrostElementalModel()],
            }),
            mana: new ManaModel({ maximum: 6, current: 6 }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({
                cards: [new BluegillWarriorModel()],
            }),
        }),
    });

    const playerA = game.playerA;
    const playerB = game.playerB;
    const frostElemental = playerA.hand.cards[0];
    const bluegill = playerB.board.minions[0];

    if (!frostElemental) throw new Error('Frost Elemental not found');
    if (!bluegill) throw new Error('Bluegill Warrior not found');

    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    it('check-initial-state', () => {
        expect(game.currentPlayer).toBe(playerA);
        expect(bluegill.role.freeze.isActived).toBe(false);
        expect(bluegill.role.action.isEnabled).toBe(undefined);
    });

    it('play-frost-elemental-and-freeze-bluegill', async () => {
        frostElemental.deployer.launch();
        playerA.controller.selectTarget(0);
        await sleep();
        playerA.controller.selectTarget(bluegill.role);
        await sleep();
        expect(bluegill.role.freeze.isActived).toBe(true);
        expect(bluegill.role.action.isEnabled).toBe(undefined);
    });

    it('freeze-persists-during-opponent-turn', () => {
        game.nextTurn();
        expect(game.currentPlayer).toBe(playerB);
        expect(bluegill.role.freeze.isActived).toBe(true);
        expect(bluegill.role.action.isEnabled).toBe(undefined);
    });

    it('freeze-clears-at-end-of-opponent-turn', () => {
        game.nextTurn();
        expect(game.currentPlayer).toBe(playerA);
        expect(bluegill.role.freeze.isActived).toBe(false);
    });
});
