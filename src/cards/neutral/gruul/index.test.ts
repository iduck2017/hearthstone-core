import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { MageModel } from "../../../heroes/mage";
import { sleep } from "../../../utils/sleep";
import { ManaModel } from "../../../rules/mana";
import { GruulModel } from "./index";

describe('gruul', () => {
    const app = new AppModel();
    const gruul = new GruulModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            hand: new HandModel({
                cards: [gruul],
            }),
            mana: new ManaModel({ maximum: 8, current: 8 }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
        }),
    });

    const playerA = game.playerA;
    const playerB = game.playerB;

    if (!gruul) throw new Error('Gruul not found');

    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    it('check-initial-state', () => {
        expect(game.currentPlayer).toBe(playerA);
        expect(gruul.role.attack.current).toBe(7);
        expect(gruul.role.health.current).toBe(7);
    });

    it('play-gruul', async () => {
        gruul.deployer.launch();
        await sleep();
        playerA.controller.selectTarget(0);
        await sleep();
        expect(playerA.board.minions.length).toBe(1);
        expect(gruul.role.attack.current).toBe(7);
        expect(gruul.role.health.current).toBe(7);
    });

    it('gruul-grows-after-turn-end', () => {
        game.nextTurn();
        expect(gruul.role.attack.current).toBe(8);
        expect(gruul.role.health.current).toBe(8);
    });

    it('gruul-grows-again-after-another-turn-end', () => {
        game.nextTurn();
        expect(gruul.role.attack.current).toBe(9);
        expect(gruul.role.health.current).toBe(9);
    });
});
