import { GameModel, MageModel, PlayerModel, RoleModel, SelectUtil, TimeUtil } from "../src";
import { boot } from "./boot";
import { WispRoleModel } from "./wisp/role";
import { WispCardModel } from "./wisp/card";
import { HandModel } from "../src/model/player/hand";
import { DeckModel } from "../src/model/player/deck";
import { BoardModel } from "../src/model/player/board";
import { AttackModel } from "../src/model/role/attack";
import { HealthModel } from "../src/model/role/health";

describe('role', () => {
    const game = new GameModel({
        child: {
            playerA: new PlayerModel({
                child: {
                    hero: new MageModel({}),
                    hand: new HandModel({}),
                    deck: new DeckModel({}),
                    board: new BoardModel({
                        child: {
                            cards: [
                                new WispCardModel({
                                    state: { mana: 1 },
                                    child: {
                                        role: new WispRoleModel({
                                            child: {
                                                attack: new AttackModel({ state: { origin: 1 } }),
                                                health: new HealthModel({ state: { origin: 3 } }),
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
                    board: new BoardModel({
                        child: {
                            cards: [
                                new WispCardModel({
                                    state: { mana: 1 },
                                    child: {
                                        role: new WispRoleModel({
                                            child: {
                                                attack: new AttackModel({ state: { origin: 1 } }),
                                                health: new HealthModel({ state: { origin: 3 } }),
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
        expect(roleA.child.action.state.current).toBe(1);
        expect(roleB.child.action.state.current).toBe(0);
        game.child.turn.next();
        expect(roleA.child.action.state.current).toBe(1);
        expect(roleB.child.action.state.current).toBe(1);
    })

    test('attribute', () => {
        const player = game.child.playerA;
        const board = player.child.board;
        const card = board.child.cards.find(item => item instanceof WispCardModel);
        const role = card?.child.role;
        expect(role).toBeDefined();
        if (!role) return;
        expect(role.child.action.state.current).toBe(1);
        expect(role.child.health.state).toMatchObject({
            buff: 0,
            origin: 3,
            memory: 3,
            damage: 0,
            limit: 3,
            current: 3,
        })
        expect(role.child.attack.state).toMatchObject({
            buff: 0,
            origin: 1,
            current: 1,
        })
    })

    test('attack', async () => {
        const playerA = game.child.playerA;
        const playerB = game.child.playerB;
        const boardA = playerA.child.board;
        const boardB = playerB.child.board;
        const wispA = boardA.child.cards.find(item => item instanceof WispCardModel);
        const wispB = boardB.child.cards.find(item => item instanceof WispCardModel);
        const heroA = playerA.child.hero;
        const heroB = playerB.child.hero;
        expect(wispA).toBeDefined();
        expect(wispB).toBeDefined();
        if (!wispA || !wispB) return;

        expect(wispA.child.role.child.health.state).toMatchObject({
            current: 3,
            damage: 0,
            limit: 3,
            memory: 3,
        })
        const promise = wispB.child.role.child.attack.run();
        await TimeUtil.sleep();
        const selector = SelectUtil.current;
        expect(selector).toBeDefined();
        if (!selector) return;
        expect(selector.list).toContain(heroA.child.role);
        expect(selector?.list).toContain(wispA.child.role);
        expect(selector?.list.length).toBe(2);
        SelectUtil.set(wispA.child.role);
        await promise;
        expect(wispA.child.role.child.health.state).toMatchObject({
            buff: 0,
            origin: 3,
            damage: 1,
            memory: 3,
            limit: 3,
            current: 2,
        })
        expect(wispB.child.role.child.health.state).toMatchObject({
            buff: 0,
            origin: 3,
            damage: 1,
            memory: 3,
            limit: 3,
            current: 2,
        })
    })
})