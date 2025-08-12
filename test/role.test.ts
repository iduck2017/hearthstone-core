import { GameModel, MageModel, PlayerModel, RoleModel, SelectUtil, TimeUtil } from "../src";
import { boot } from "./boot";
import { WispRoleModel } from "./wisp/role";
import { WispCardModel } from "./wisp/card";
import { HandModel } from "../src/model/player/hand";
import { DeckModel } from "../src/model/player/deck";
import { BoardModel } from "../src/model/player/board";

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
                                            state: {
                                                rawAttack: 1,
                                                rawHealth: 2,
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
                                            state: {
                                                rawAttack: 1,
                                                rawHealth: 2,
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
        expect(roleA.state.action).toBe(1);
        expect(roleB.state.action).toBe(1);
    })

    test('attack-health', () => {
        const player = game.child.playerA;
        const board = player.child.board;
        const card = board.child.cards.find(item => item instanceof WispCardModel);
        const role = card?.child.role;
        expect(role).toBeDefined();
        if (!role) return;
        expect(role.state.health).toBe(2);
        expect(role.state.damage).toBe(0);
        expect(role.state.maxHealth).toBe(2);
        expect(role.state.attack).toBe(1);
        expect(role.state.isDead).toBe(false);
        expect(role.state.action).toBe(1);
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

        const promise = wispB.child.role.attack();
        await TimeUtil.sleep();
        const selector = SelectUtil.current;
        expect(selector).toBeDefined();
        if (!selector) return;
        expect(selector.targets).toContain(heroA.child.role);
        expect(selector?.targets).toContain(wispA.child.role);
        expect(selector?.targets.length).toBe(2);
        SelectUtil.set(wispA.child.role);
        await promise;
        
        const roleA = wispA.child.role;
        const roleB = wispB.child.role;
        expect(roleA.state.health).toBe(1);
        expect(roleA.state.damage).toBe(1);
        expect(roleA.state.maxHealth).toBe(2);
        expect(roleA.state.attack).toBe(1);
        expect(roleA.state.isDead).toBe(false);
        expect(roleA.state.action).toBe(1);

        expect(roleB.state.health).toBe(1);
        expect(roleB.state.damage).toBe(1);
        expect(roleB.state.maxHealth).toBe(2);
        expect(roleB.state.attack).toBe(1);
        expect(roleB.state.isDead).toBe(false);
        expect(roleB.state.action).toBe(0);
    })


    test('death', async () => {
        const playerA = game.child.playerA;
        const playerB = game.child.playerB;
        const boardA = playerA.child.board;
        const boardB = playerB.child.board;
        const graveyardA = playerA.child.graveyard;
        const graveyardB = playerB.child.graveyard;
        const wispA = boardA.child.cards.find(item => item instanceof WispCardModel);
        const wispB = boardB.child.cards.find(item => item instanceof WispCardModel);
        expect(wispA).toBeDefined();
        expect(wispB).toBeDefined();
        if (!wispA || !wispB) return;

        game.nextTurn();
        const promise = wispA.child.role.attack();
        await TimeUtil.sleep();
        const selector = SelectUtil.current;
        if (!selector) return;
        expect(selector?.targets).toContain(wispB.child.role);
        expect(selector?.targets.length).toBe(2);
        SelectUtil.set(wispB.child.role);
        await promise;

        
        const roleA = wispA.child.role;
        const roleB = wispB.child.role;
        expect(roleA.state.health).toBe(0);
        expect(roleA.state.damage).toBe(2);
        expect(roleA.state.maxHealth).toBe(2);
        expect(roleA.state.attack).toBe(1);
        expect(roleA.state.isDead).toBe(true);
        expect(roleA.state.action).toBe(0);

        expect(roleB.state.health).toBe(0);
        expect(roleB.state.damage).toBe(2);
        expect(roleB.state.maxHealth).toBe(2);
        expect(roleB.state.attack).toBe(1);
        expect(roleB.state.isDead).toBe(true);
        expect(roleB.state.action).toBe(0);

        expect(boardA.child.cards.length).toBe(0);
        expect(boardB.child.cards.length).toBe(0);
        expect(graveyardA.child.cards.length).toBe(1);
        expect(graveyardB.child.cards.length).toBe(1);
        expect(wispA.route.board).not.toBeDefined();
        expect(wispB.route.board).not.toBeDefined();
        expect(wispA.route.graveyard).toBeDefined();
        expect(wispB.route.graveyard).toBeDefined();
    })
})