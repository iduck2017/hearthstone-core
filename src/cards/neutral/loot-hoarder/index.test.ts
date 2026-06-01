import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { DeckModel } from "../../../entities/deck";
import { HandModel } from "../../../entities/hand";
import { WispModel } from "../wisp";
import { LootHoarderModel } from "./index";
import { sleep } from "../../../utils/sleep";

describe('loot-hoarder', () => {
    const app = new AppModel();

    const topCard = new WispModel();
    const lootHoarder = new LootHoarderModel();
    const target = new WispModel();

    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({
                cards: [lootHoarder],
            }),
            deck: new DeckModel({
                cards: [topCard],
            }),
            hand: new HandModel({
                cards: [],
            }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({
                cards: [target],
            }),
        }),
    });

    app.setGame(game);
    game.start({
        isInitPhaseIgnored: true
    });

    const playerA = game.playerA;
    const playerB = game.playerB;

    it('check-initial-state', () => {
        expect(playerA.board.cards).toContain(lootHoarder);

        expect(playerA.deck.cards).toContain(topCard);
        expect(playerA.hand.cards.length).toBe(0);

        expect(playerB.board.cards).toContain(target);
    });

    it('deathrattle-draws-top-card-on-death', async () => {
        expect(lootHoarder.role.action.isEnabled).toBe(true);

        lootHoarder.role.action.launch();
        await sleep();
        playerA.controller.selectTarget(target.role);
        await sleep();

        expect(lootHoarder.disposer.isActived).toBe(true);
        expect(playerA.board.minions.length).toBe(0);

        expect(playerA.hand.cards).toContain(topCard);
        expect(playerA.deck.cards.length).toBe(0);
    });
});
