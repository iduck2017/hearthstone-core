import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { DeckModel } from "../../../entities/deck";
import { AbusiveSergeantModel } from "./index";
import { WispModel } from "../wisp";
import { sleep } from "../../../utils/sleep";

describe('abusive-sergeant', () => {
    const app = new AppModel();
    const abusiveSergeant = new AbusiveSergeantModel();
    const wisp = new WispModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            hand: new HandModel({
                cards: [abusiveSergeant],
            }),
            board: new BoardModel({
                cards: [wisp],
            }),
            deck: new DeckModel(),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
        }),
    });
    const playerA = game.playerA;
    app.setGame(game);
    game.start();

    it('check-initial-state', () => {
        expect(playerA.hand.cards).toContain(abusiveSergeant);
        expect(playerA.mana.current).toBe(1);
        expect(wisp.role.attack.current).toBe(1);
    })

    it('play-abusive-sergeant', async () => {
        abusiveSergeant.launcher.run();
        await sleep();
        playerA.controller.selectTarget(0);
        await sleep();
        const options = playerA.controller.selector?.options;
        expect(options).toContain(wisp.role);
        playerA.controller.selectTarget(wisp.role);
        await sleep();
        expect(playerA.board.cards).toContain(abusiveSergeant);
        expect(wisp.role.attack.current).toBe(3);
    })

    it('buff-removed-on-turn-end', async () => {
        expect(game.turn).toBe(1);
        game.nextTurn();
        expect(game.turn).toBe(2);
        expect(wisp.role.attack.current).toBe(1);
    })
})
