import { GameModel, MageCardModel, PlayerModel, RoleModel, SelectUtil, TimeUtil } from "../src";
import { boot } from "./boot";
import { WispRoleModel } from "./wisp/role";
import { WispCardModel } from "./wisp/card";
import { HandModel } from "../src/model/hand";
import { DeckModel } from "../src/model/deck";
import { BoardModel } from "../src/model/board";

describe('role', () => {
    const game = new GameModel({
        child: {
            playerA: new PlayerModel({
                child: {
                    hero: new MageCardModel({}),
                    hand: new HandModel({}),
                    deck: new DeckModel({}),
                    board: new BoardModel({
                        child: {
                            cards: [
                                new WispCardModel({
                                    state: { mana: 1 },
                                    child: {
                                        role: new WispRoleModel({
                                            state: {
                                                attack: 1,
                                                health: 3,
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
                    hero: new MageCardModel({}),
                    hand: new HandModel({}),
                    deck: new DeckModel({}),
                    board: new BoardModel({
                        child: {
                            cards: [
                                new WispCardModel({
                                    state: { mana: 1 },
                                    child: {
                                        role: new WispRoleModel({
                                            state: {
                                                attack: 1,
                                                health: 3,
                                            }
                                        })
                                    }
                                })
                            ]
                        }
                    }),
                },
            }),
        }
    });
    boot(game)


    test('action', () => {
        const playerA = game.child.playerA;
        const playerB = game.child.playerB;
        const boardA = playerA.child.board;
        const boardB = playerB.child.board;
        const cardA = boardA.child.cards.find(item => item instanceof WispCardModel);
        const cardB = boardB.child.cards.find(item => item instanceof WispCardModel);
        const roleA = cardA?.child.role;
        const roleB = cardB?.child.role;
        expect(roleA).toBeDefined();
        expect(roleB).toBeDefined();
        if (!roleA || !roleB) return;
        expect(roleA.state.action).toBe(1);
        expect(roleB.state.action).toBe(0);
        game.nextTurn();
        expect(roleA.state.action).toBe(0);
        expect(roleB.state.action).toBe(1);
    })

    
    test('attr', () => {
        const player = game.child.playerA;
        const board = player.child.board;
        const card = board.child.cards.find(item => item instanceof WispCardModel);
        const role = card?.child.role;
        expect(role).toBeDefined();
        if (!role) return;
        expect(role.state).toMatchObject({
            health: 3,
            modHealth: 0,
            maxHealth: 3,
            refHealth: 3,
            curHealth: 3,
            damage: 0,
            attack: 1,
            modAttack: 0,
            curAttack: 1,
        })
    })

    test('attack', async () => {
        const playerA = game.child.playerA;
        const playerB = game.child.playerB;
        const boardA = playerA.child.board;
        const boardB = playerB.child.board;
        const cardA = boardA.child.cards.find(item => item instanceof WispCardModel);
        const cardB = boardB.child.cards.find(item => item instanceof WispCardModel);
        const roleA = cardA?.child.role;
        const roleB = cardB?.child.role;
        expect(roleA).toBeDefined();
        expect(roleB).toBeDefined();
        if (!roleA || !roleB) return;

        expect(roleA.state).toMatchObject({
            health: 3,
            action: 0,
            damage: 0,
            maxHealth: 3,
            curHealth: 3,
            curAttack: 1,
        })
        expect(roleB.state).toMatchObject({
            health: 3,
            action: 1,
            damage: 0,
            maxHealth: 3,
            curHealth: 3,
            curAttack: 1,
        })

        const promise = roleB.attack();
        await TimeUtil.sleep();
        const selector = SelectUtil.current;
        expect(selector).toBeDefined();
        if (!selector) return;
        expect(selector.candidates).toContain(playerA.child.hero);
        expect(selector?.candidates).toContain(cardA);
        expect(selector?.candidates.length).toBe(2);
        SelectUtil.set(cardA);
        await promise;

        expect(roleA.state).toMatchObject({
            health: 3,
            action: 0,
            damage: 1,
            maxHealth: 3,
            refHealth: 3,
            curHealth: 2,
            curAttack: 1,
        })
        expect(roleB.state).toMatchObject({
            health: 3,
            action: 0,
            damage: 1,
            maxHealth: 3,
            refHealth: 3,
            curHealth: 2,
            curAttack: 1,
        })
    })
})