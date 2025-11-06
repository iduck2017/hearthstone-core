import { BoardModel, DeckModel, GameModel, HandModel, MageModel, PlayerModel, AnimeUtil } from "../src";
import { WispModel } from "./wisp";
import { DebugUtil } from "set-piece";
import { boot } from "./boot";

describe('game', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true }},
        child: {
            playerA: new PlayerModel({
                child: {
                    hand: new HandModel(),
                    deck: new DeckModel({
                        child: { 
                            minions: [
                                new WispModel(),
                                new WispModel(),
                            ]
                        }
                    }),
                    board: new BoardModel({
                        child: {
                            cards: [
                                new WispModel(),
                            ]
                        }
                    }),
                    hero: new MageModel()
                }
            }),
            playerB: new PlayerModel({
                child: {
                    hand: new HandModel(),
                    deck: new DeckModel({
                        child: { 
                            minions: [
                                new WispModel(),
                                new WispModel()
                            ]
                        }
                    }),
                    board: new BoardModel({
                        child: {
                            cards: [new WispModel()]
                        }
                    }),
                    hero: new MageModel()
                }
            }),
        }
    });
    const player = game.child.playerA;
    const board = player.child.board;
    const hand = player.child.hand;
    const deck = player.child.deck;
    const turn = game.child.turn;

    test('next-turn', () => {
        expect(turn.state.current).toBe(0);
        boot(game);
        expect(turn.state.current).toBe(1);
        game.child.turn.next();
        expect(turn.state.current).toBe(2);
    })

    test('draw-card', async () => {
        expect(deck.child.minions.length).toBe(2);
        expect(hand.child.minions.length).toBe(0);
        let card = deck.draw();
        expect(card).toBeDefined();
        expect(deck.child.minions.length).toBe(1);
        expect(hand.child.minions.length).toBe(1);

        card = deck.draw();
        expect(deck.child.minions.length).toBe(0);
        expect(hand.child.minions.length).toBe(2);
    })

    test('play-card', async () => {
        turn.next();

        let card = hand.child.minions[0];
        expect(board.child.cards.length).toBe(1);
        // expect(board.refer.order.length).toBe(1);
        expect(hand.child.minions.length).toBe(2);
        expect(card).toBeDefined();

        let promise = card?.play();
        await AnimeUtil.sleep()
        let selector = player.child.controller.current;
        expect(selector).toBeDefined();
        expect(selector?.options).toContain(0);
        expect(selector?.options).toContain(1);
        expect(selector?.options.length).toBe(2);
        player.child.controller.set(0);
        await promise;
        
        // minions
        expect(board.child.cards.length).toBe(2);
        expect(board.child.cards[1]).toBe(card);
        // order
        // expect(board.refer.order.length).toBe(2);
        // expect(board.refer.order[0]).toBe(card);
        // hand
        expect(hand.child.minions.length).toBe(1);

        card = hand.child.minions[0];
        promise = card?.play();
        await AnimeUtil.sleep();
        selector = player.child.controller.current;
        expect(selector).toBeDefined();
        expect(selector?.options.length).toBe(3);
        player.child.controller.set(1);
        await promise;
        // expect(board.refer.order.length).toBe(3);
        expect(board.child.cards[2]).toBe(card);
        // expect(board.refer.order[1]).toBe(card);
    })
})