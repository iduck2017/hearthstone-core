import { BoardModel, GameModel, HandModel, MageModel, PlayerModel, SelectUtil, TimeUtil } from "../src";
import { DeckModel } from "../src/model/player/deck";
import { AttackModel } from "../src/model/role/attack";
import { HealthModel } from "../src/model/role/health";
import { boot } from "./boot";
import { WispCardModel } from "./wisp/card";
import { WispRoleModel } from "./wisp/role";

describe('game', () => {
    const game = new GameModel({
        child: {
            playerA: new PlayerModel({
                child: {
                    hero: new MageModel({}),
                    hand: new HandModel({}),
                    deck: new DeckModel({
                        child: {
                            cards: [
                                new WispCardModel({
                                    state: { mana: 1 },
                                    child: {
                                        role: new WispRoleModel({
                                            child: {
                                                attack: new AttackModel({ state: { origin: 1 } }),
                                                health: new HealthModel({ state: { origin: 1 } }),
                                            }
                                        })
                                    }
                                }),
                                new WispCardModel({
                                    state: { mana: 1 },
                                    child: {
                                        role: new WispRoleModel({
                                            child: {
                                                attack: new AttackModel({ state: { origin: 1 } }),
                                                health: new HealthModel({ state: { origin: 1 } }),
                                            }
                                        })
                                    }
                                })
                            ]
                        }
                    }),
                    board: new BoardModel({
                        child: {
                            cards: [
                                new WispCardModel({
                                    state: { mana: 1 },
                                    child: {
                                        role: new WispRoleModel({
                                            child: {
                                                attack: new AttackModel({ state: { origin: 1 } }),
                                                health: new HealthModel({ state: { origin: 1 } }),
                                            }
                                        })
                                    }
                                })
                            ]
                        }
                    }),
                },
            }),
            playerB: new PlayerModel({
                child: {
                    hero: new MageModel({}),
                    hand: new HandModel({}),
                    deck: new DeckModel({}),
                    board: new BoardModel({}),
                },
            }),
        }
    });

    test('next-turn', () => {
        const turn = game.child.turn;
        expect(turn.state.count).toBe(0);
        boot(game);
        expect(turn.state.count).toBe(1);
        turn.next();
        expect(turn.state.count).toBe(2);
    })

    test('draw-card', async () => {
        const player = game.child.playerA;
        const hand = player.child.hand;
        const deck = player.child.deck;

        let card = deck.get({});
        expect(deck.child.cards.length).toBe(2);
        expect(hand.child.cards.length).toBe(0);
        expect(card).toBeDefined();
        card?.draw();
        expect(deck.child.cards.length).toBe(1);
        expect(hand.child.cards.length).toBe(1);

        card = deck.get({});
        card?.draw();
        expect(deck.child.cards.length).toBe(0);
        expect(hand.child.cards.length).toBe(2);
    })

    test('play-card', async () => {
        const player = game.child.playerA;
        const board = player.child.board;
        const hand = player.child.hand;
        const deck = player.child.deck;

        let card = hand.child.cards[0];
        expect(board.child.cards.length).toBe(1);
        expect(hand.child.cards.length).toBe(2);
        expect(card).toBeDefined();

        let promise = card?.play();
        await TimeUtil.sleep()
        let selector = SelectUtil.current;
        expect(selector).toBeDefined();
        expect(selector?.list).toContain(0);
        expect(selector?.list).toContain(1);
        expect(selector?.list.length).toBe(2);
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
        expect(selector?.list.length).toBe(3);
        SelectUtil.set(1);
        await promise;
        expect(board.child.cards[1]).toBe(card);
    })

})