import { DeathStatus, GameModel, MageModel, PlayerModel } from "../src";
import { boot } from "./boot";
import { HandModel } from "../src/models/containers/hand";
import { DeckModel } from "../src/models/containers/deck";
import { BoardModel } from "../src/models/containers/board";
import { WispModel } from "./wisp";

describe('role', () => {
    const game = new GameModel({
        child: {
            playerA: new PlayerModel({
                child: {
                    character: new MageModel({}),
                    hand: new HandModel({}),
                    deck: new DeckModel({}),
                    board: new BoardModel({
                        child: { 
                            minions: [new WispModel({})]
                        }
                    }),
                }
            }),
            playerB: new PlayerModel({
                child: {
                    character: new MageModel({}),
                    hand: new HandModel({}),
                    deck: new DeckModel({}),
                    board: new BoardModel({
                        child: { 
                            minions: [new WispModel({})]
                        }
                    }),
                }
            })
        }
    });
    boot(game)
    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const boardA = playerA.child.board;
    const boardB = playerB.child.board;
    const cardA = boardA.child.minions.find(item => item instanceof WispModel);
    const cardB = boardB.child.minions.find(item => item instanceof WispModel);
    const roleA = cardA?.child.role;
    const roleB = cardB?.child.role;
    const turn = game.child.turn;
    if (!roleA || !roleB) throw new Error()

    test('initial-state', () => {
        // roleB
        expect(roleB.child.action.state.current).toBe(1);
        // roleA
        expect(roleA.child.action.state.current).toBe(1);
        expect(roleA.child.health.state.current).toBe(1);
        expect(roleA.child.health.state.damage).toBe(0);
        expect(roleA.child.health.state.limit).toBe(1);
        expect(roleA.child.attack.state.current).toBe(1);
        expect(roleA.child.death.state.status).toBe(DeathStatus.INACTIVE);
    })


    // test('attack', async () => {
    //     const playerA = game.child.playerA;
    //     const playerB = game.child.playerB;
    //     const boardA = playerA.child.board;
    //     const boardB = playerB.child.board;
    //     const cardA = boardA.child.cards.find(item => item instanceof WispModel);
    //     const cardB = boardB.child.cards.find(item => item instanceof WispModel);
    //     const roleA = cardA?.child.minion;
    //     const roleB = cardB?.child.minion;
    //     expect(roleA).toBeDefined();
    //     expect(roleB).toBeDefined();
    //     if (!roleA || !roleB) return;

    //     const promise = roleB.child.action.run();
        
    //     await TimeUtil.sleep();
    //     const selector = SelectUtil.current;
    //     expect(selector).toBeDefined();
    //     if (!selector) return;
    //     expect(selector.options).toContain(playerA.child.role);
    //     expect(selector?.options).toContain(cardA.child.minion);
    //     expect(selector?.options.length).toBe(2);
    //     SelectUtil.set(cardA.child.minion);
    //     await promise;

    //     expect(roleA.state.health).toBe(1);
    //     expect(roleA.child.health.state.damage).toBe(1);
    //     expect(roleA.child.health.state.limit).toBe(2);
    //     expect(roleA.child.attack.state.current).toBe(1);
    //     expect(roleA.child.death.state.status).toBe(DeathStatus.INACTIVE);
    //     expect(roleA.child.action.state.current).toBe(1);

    //     expect(roleB.state.health).toBe(1);
    //     expect(roleB.child.health.state.damage).toBe(1);
    //     expect(roleB.child.health.state.limit).toBe(2);
    //     expect(roleB.child.attack.state.current).toBe(1);
    //     expect(roleB.child.death.state.status).toBe(DeathStatus.INACTIVE);
    //     expect(roleB.child.action.state.current).toBe(0);
    // })


    // test('death', async () => {
    //     const playerA = game.child.playerA;
    //     const playerB = game.child.playerB;
    //     const boardA = playerA.child.board;
    //     const boardB = playerB.child.board;
    //     const graveyardA = playerA.child.graveyard;
    //     const graveyardB = playerB.child.graveyard;
    //     const cardA = boardA.child.cards.find(item => item instanceof WispModel);
    //     const cardB = boardB.child.cards.find(item => item instanceof WispModel);
    //     const roleA = cardA?.child.minion;
    //     const roleB = cardB?.child.minion;
    //     expect(roleA).toBeDefined();
    //     expect(roleB).toBeDefined();
    //     if (!roleA || !roleB) return;

    //     game.child.turn.next();
    //     const promise = roleA.child.action.run();
    //     await TimeUtil.sleep();
    //     const selector = SelectUtil.current;
    //     if (!selector) return;
    //     expect(selector?.options).toContain(cardB.child.minion);
    //     expect(selector?.options.length).toBe(2);
    //     SelectUtil.set(cardB.child.minion);
    //     await promise;
        
    //     expect(roleA.state.health).toBe(0);
    //     expect(roleA.child.health.state.damage).toBe(2);
    //     expect(roleA.child.health.state.limit).toBe(2);
    //     expect(roleA.child.attack.state.current).toBe(1);
    //     expect(roleA.child.death.state.status).toBe(DeathStatus.ACTIVE);
        
    //     expect(roleA.child.action.state.current).toBe(0);
    //     expect(roleA.child.action.state.cost).toBe(1);
    //     expect(roleA.child.action.state.origin).toBe(1);

    //     expect(roleB.child.health.state.current).toBe(0);
    //     expect(roleB.child.health.state.damage).toBe(2);
    //     expect(roleB.child.health.state.limit).toBe(2);
    //     expect(roleB.child.attack.state.current).toBe(1);
    //     expect(roleB.child.death.state.status).toBe(DeathStatus.ACTIVE);
    //     expect(roleB.child.action.state.current).toBe(0);

    //     expect(boardA.child.cards.length).toBe(0);
    //     expect(boardB.child.cards.length).toBe(0);
    //     expect(graveyardA.child.cards.length).toBe(1);
    //     expect(graveyardB.child.cards.length).toBe(1);
    //     expect(cardA.route.board).not.toBeDefined();
    //     expect(cardB.route.board).not.toBeDefined();
    //     expect(cardA.route.graveyard).toBeDefined();
    //     expect(cardB.route.graveyard).toBeDefined();
    // })
})