import { GameModel, MageModel, PlayerModel, SelectUtil, TimeUtil } from "../src";
import { boot } from "./boot";
import { WispRoleModel } from "./wisp/role";
import { WispCardModel } from "./wisp/card";
import { HandModel } from "../src/model/player/hand";
import { DeckModel } from "../src/model/player/deck";
import { BoardModel } from "../src/model/player/board";
import { HealthModel } from "../src/model/role/health";
import { AttackModel } from "../src/model/role/attack";
import { DeathStatus } from "../src/model/role/death";

describe('role', () => {
    const game = new GameModel({
        child: {
            playerA: new PlayerModel({
                child: {
                    hero: new MageModel({}),
                    hand: new HandModel({}),
                    deck: new DeckModel({}),
                    board: new BoardModel({
                        child: { cards: [
                            new WispCardModel({
                                state: { mana: 1 },
                                child: {
                                    role: new WispRoleModel({
                                        child: {
                                            health: new HealthModel({ state: { origin: 2 } }),
                                            attack: new AttackModel({ state: { origin: 1 } }),
                                        }
                                    })
                                }
                            })
                        ]}
                    }),
                },
            }),
            playerB: new PlayerModel({
                child: {
                    hero: new MageModel({}),
                    hand: new HandModel({}),
                    deck: new DeckModel({}),
                    board: new BoardModel({
                        child: { cards: [
                            new WispCardModel({
                                state: { mana: 1 },
                                child: {
                                    role: new WispRoleModel({
                                        child: {
                                            health: new HealthModel({ state: { origin: 2 } }),
                                            attack: new AttackModel({ state: { origin: 1 } }),
                                        }
                                    })
                                }
                            })
                        ]}
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
        expect(roleB.child.action.state.current).toBe(1);
        game.child.turn.next();
        expect(roleA.child.action.state.current).toBe(1);
        expect(roleB.child.action.state.current).toBe(1);
    })

    test('attack-health', () => {
        const player = game.child.playerA;
        const board = player.child.board;
        const card = board.child.cards.find(item => item instanceof WispCardModel);
        const role = card?.child.role;
        expect(role).toBeDefined();
        if (!role) return;
        expect(role.child.health.state.current).toBe(2);
        expect(role.child.health.state.damage).toBe(0);
        expect(role.child.health.state.limit).toBe(2);
        expect(role.child.attack.state.current).toBe(1);
        expect(role.child.death.state.status).toBe(DeathStatus.INACTIVE);
        expect(role.child.action.state.current).toBe(1);
    })

    test('attack', async () => {
        const playerA = game.child.playerA;
        const playerB = game.child.playerB;
        const boardA = playerA.child.board;
        const boardB = playerB.child.board;
        const cardA = boardA.child.cards.find(item => item instanceof WispCardModel);
        const cardB = boardB.child.cards.find(item => item instanceof WispCardModel);
        const heroA = playerA.child.hero;
        const heroB = playerB.child.hero;
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        if (!cardA || !cardB) return;

        const promise = cardB.child.role.child.action.run();
        await TimeUtil.sleep();
        const selector = SelectUtil.current;
        expect(selector).toBeDefined();
        if (!selector) return;
        expect(selector.options).toContain(heroA.child.role);
        expect(selector?.options).toContain(cardA.child.role);
        expect(selector?.options.length).toBe(2);
        SelectUtil.set(cardA.child.role);
        await promise;
        
        const roleA = cardA.child.role;
        const roleB = cardB.child.role;
        expect(roleA.state.health).toBe(1);
        expect(roleA.child.health.state.damage).toBe(1);
        expect(roleA.child.health.state.limit).toBe(2);
        expect(roleA.child.attack.state.current).toBe(1);
        expect(roleA.child.death.state.status).toBe(DeathStatus.INACTIVE);
        expect(roleA.child.action.state.current).toBe(1);

        expect(roleB.state.health).toBe(1);
        expect(roleB.child.health.state.damage).toBe(1);
        expect(roleB.child.health.state.limit).toBe(2);
        expect(roleB.child.attack.state.current).toBe(1);
        expect(roleB.child.death.state.status).toBe(DeathStatus.INACTIVE);
        expect(roleB.child.action.state.current).toBe(0);
    })


    test('death', async () => {
        const playerA = game.child.playerA;
        const playerB = game.child.playerB;
        const boardA = playerA.child.board;
        const boardB = playerB.child.board;
        const graveyardA = playerA.child.graveyard;
        const graveyardB = playerB.child.graveyard;
        const cardA = boardA.child.cards.find(item => item instanceof WispCardModel);
        const cardB = boardB.child.cards.find(item => item instanceof WispCardModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        if (!cardA || !cardB) return;

        game.child.turn.next();
        const promise = cardA.child.role.child.action.run();
        await TimeUtil.sleep();
        const selector = SelectUtil.current;
        if (!selector) return;
        expect(selector?.options).toContain(cardB.child.role);
        expect(selector?.options.length).toBe(2);
        SelectUtil.set(cardB.child.role);
        await promise;
        
        const roleA = cardA.child.role;
        const roleB = cardB.child.role;
        expect(roleA.state.health).toBe(0);
        expect(roleA.child.health.state.damage).toBe(2);
        expect(roleA.child.health.state.limit).toBe(2);
        expect(roleA.child.attack.state.current).toBe(1);
        expect(roleA.child.death.state.status).toBe(DeathStatus.ACTIVE);
        
        expect(roleA.child.action.state.current).toBe(0);
        expect(roleA.child.action.state.cost).toBe(1);
        expect(roleA.child.action.state.origin).toBe(1);

        expect(roleB.child.health.state.current).toBe(0);
        expect(roleB.child.health.state.damage).toBe(2);
        expect(roleB.child.health.state.limit).toBe(2);
        expect(roleB.child.attack.state.current).toBe(1);
        expect(roleB.child.death.state.status).toBe(DeathStatus.ACTIVE);
        expect(roleB.child.action.state.current).toBe(0);

        expect(boardA.child.cards.length).toBe(0);
        expect(boardB.child.cards.length).toBe(0);
        expect(graveyardA.child.cards.length).toBe(1);
        expect(graveyardB.child.cards.length).toBe(1);
        expect(cardA.route.board).not.toBeDefined();
        expect(cardB.route.board).not.toBeDefined();
        expect(cardA.route.graveyard).toBeDefined();
        expect(cardB.route.graveyard).toBeDefined();
    })
})