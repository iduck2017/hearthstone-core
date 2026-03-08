import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { LeperGnomeModel } from "./index";
import { WispModel } from "../wisp";
import { sleep } from "../../../utils/sleep";

describe('leper-gnome', () => {
    const app = new AppModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({
                cards: [new LeperGnomeModel()],
            }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({
                cards: [new WispModel()],
            }),
        }),
    });
    
    app.setGame(game);
    game.start();

    const playerA = game.playerA;
    const playerB = game.playerB;
    const leperGnome = playerA.board.minions[0];
    const wisp = playerB.board.minions[0];
    if (!leperGnome) throw new Error('Leper Gnome not found');
    if (!wisp) throw new Error('Wisp not found');

    it('check-initial-state', () => {
        expect(game.currentPlayer).toBe(game.playerA);
        expect(playerA.board.cards.length).toBe(1);
        expect(playerB.board.cards.length).toBe(1);
        expect(leperGnome.role.health.current).toBe(1);
        expect(wisp.role.health.current).toBe(1);
    });

    it('leper-gnome-attack-wisp', async () => {
        expect(leperGnome.role.isAttackEnabled).toBe(true);

        leperGnome.role.runAttack();
        await sleep();
        playerA.controller.selectTarget(wisp.role);
        await sleep();

        expect(wisp.role.health.current).toBe(-1);
        expect(leperGnome.role.health.current).toBe(0);
        expect(leperGnome.disposer.isActived).toBe(true);
        expect(wisp.disposer.isActived).toBe(true);

        const heroB = playerB.hero;
        const heroA = playerA.hero;
        expect(heroB.role.health.current).toBe(28);
        expect(heroA.role.health.current).toBe(30);
    })
    
});
