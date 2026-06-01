
import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { DeckModel } from "../../../entities/deck";
import { HandModel } from "../../../entities/hand";
import { ManaModel } from "../../../rules/mana";
import { WispModel } from "../wisp";
import { NoviceEngineerModel } from "./index";
import { sleep } from "../../../utils/sleep";

describe('novice-engineer', () => {
    const app = new AppModel();
    const wisp = new WispModel();
    const noviceEngineer = new NoviceEngineerModel();

    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            hand: new HandModel({
                cards: [noviceEngineer],
            }),
            board: new BoardModel(),
            deck: new DeckModel({
                cards: [wisp],
            }),
            mana: new ManaModel({ maximum: 2 }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
        }),
    });

    app.setGame(game);
    game.start({
        isInitPhaseIgnored: true,
    });

    const playerA = game.playerA;

    it('check-initial-state', () => {
        expect(playerA.hand.cards).toContain(noviceEngineer);
        expect(playerA.deck.cards).toContain(wisp);
        expect(playerA.board.cards.length).toBe(0);
    });

    it('battlecry-draws-top-card-on-play', async () => {
        noviceEngineer.deployer.launch();
        await sleep();
        playerA.controller.selectTarget(0);
        await sleep();

        expect(playerA.board.cards).toContain(noviceEngineer);
        expect(playerA.hand.cards).toContain(wisp);
        expect(playerA.deck.cards.length).toBe(0);
    });
});
