import { BoardModel, GameModel, HandModel, MageModel, MinionModel, PlayerModel, RoleModel, SelectUtil, TimeUtil } from "../src";
import { CostModel } from "../src/models/rules/cost";
import { DeckModel } from "../src/models/containers/deck";
import { AttackModel } from "../src/models/rules/attack";
import { HealthModel } from "../src/models/rules/health";
import { boot } from "./boot";
import { WispModel } from "./card";

describe('game', () => {
    const game = new GameModel({
        child: {
            playerA: new MageModel({
                child: {
                    hand: new HandModel({}),
                    deck: new DeckModel({
                        child: { cards: [
                            new WispModel({
                                child: {
                                    cost: new CostModel({ state: { origin: 0 } }),
                                    minion: new MinionModel({
                                        state: { races: [] },
                                        child: {
                                            health: new HealthModel({ state: { origin: 1 } }),
                                            attack: new AttackModel({ state: { origin: 1 } }),
                                        }
                                    })
                                }
                            }),
                            new WispModel({
                                child: {
                                    cost: new CostModel({ state: { origin: 0 } }),
                                    minion: new MinionModel({
                                        state: { races: [] },
                                        child: {
                                            health: new HealthModel({ state: { origin: 1 } }),
                                            attack: new AttackModel({ state: { origin: 1 } }),
                                        }
                                    })
                                }
                            })
                        ]}
                    }),
                    board: new BoardModel({
                        child: { cards: [
                            new WispModel({
                                child: {
                                    cost: new CostModel({ state: { origin: 0 } }),
                                    minion: new MinionModel({
                                        state: { races: [] },
                                        child: {
                                            health: new HealthModel({ state: { origin: 1 } }),
                                            attack: new AttackModel({ state: { origin: 1 } }),
                                        }
                                    })
                                }
                            })
                        ]}
                    }),
                },
            }),
            playerB: new MageModel({
                child: {
                    hand: new HandModel({}),
                    deck: new DeckModel({}),
                    board: new BoardModel({}),
                },
            }),
        }
    });

    test('next-turn', () => {
        expect(game.child.turn.state.count).toBe(0);
        boot(game);
        expect(game.child.turn.state.count).toBe(1);
        game.child.turn.next();
        expect(game.child.turn.state.count).toBe(2);
    })

    test('draw-card', async () => {
        const player = game.child.playerA;
        const hand = player.child.hand;
        const deck = player.child.deck;

        expect(deck.child.cards.length).toBe(2);
        expect(hand.child.cards.length).toBe(0);
        let card = deck.draw();
        expect(card).toBeDefined();
        expect(deck.child.cards.length).toBe(1);
        expect(hand.child.cards.length).toBe(1);

        card = deck.draw();
        expect(deck.child.cards.length).toBe(0);
        expect(hand.child.cards.length).toBe(2);
    })

    test('play-card', async () => {
        const player = game.child.playerA;
        const board = player.child.board;
        const hand = player.child.hand;
        const deck = player.child.deck;

        game.child.turn.next();

        let card = hand.child.cards[0];
        expect(board.child.cards.length).toBe(1);
        expect(hand.child.cards.length).toBe(2);
        expect(card).toBeDefined();

        let promise = card?.play();
        await TimeUtil.sleep()
        let selector = SelectUtil.current;
        expect(selector).toBeDefined();
        expect(selector?.options).toContain(0);
        expect(selector?.options).toContain(1);
        expect(selector?.options.length).toBe(2);
        SelectUtil.set(0);
        await promise;
        expect(board.child.cards.length).toBe(2);
        expect(board.child.cards[0]).toBe(card);
        expect(hand.child.cards.length).toBe(1);

        card = hand.child.cards[0];
        promise = card?.play();
        await TimeUtil.sleep();
        selector = SelectUtil.current;
        expect(selector).toBeDefined();
        expect(selector?.options.length).toBe(3);
        SelectUtil.set(1);
        await promise;
        expect(board.child.cards[1]).toBe(card);
    })
})