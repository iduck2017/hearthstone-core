import { DeathStatus, GameModel, MageModel, PlayerModel, SelectUtil, TimeUtil } from "../src";
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
    const cardC = boardA.child.minions.find(item => item instanceof WispModel);
    const cardD = boardB.child.minions.find(item => item instanceof WispModel);
    const roleC = cardC?.child.role;
    const roleD = cardD?.child.role;
    const roleA = playerA.child.character.child.role;
    const roleB = playerB.child.character.child.role;
    const turn = game.child.turn;
    if (!roleC || !roleD) throw new Error()

    test('initial-state', () => {
        // roleB
        expect(roleD.child.action.state.current).toBe(1);
        // roleA
        expect(roleC.child.action.state.current).toBe(1);
        expect(roleC.child.health.state.current).toBe(1);
        expect(roleC.child.health.state.damage).toBe(0);
        expect(roleC.child.health.state.limit).toBe(1);
        expect(roleC.child.attack.state.current).toBe(1);
        expect(roleC.child.death.state.status).toBe(DeathStatus.INACTIVE);
    })


    test('wisp-attack-hero', async () => {
        const promise = roleC.child.action.run();
        await TimeUtil.sleep();
        const selector = SelectUtil.current;
        expect(selector).toBeDefined();
        if (!selector) return;
        expect(selector.options).toContain(roleB);
        expect(selector?.options).toContain(roleD);
        expect(selector?.options.length).toBe(2);
        SelectUtil.set(roleB);
        await promise;

        expect(roleB.child.health.state.current).toBe(29);
        expect(roleB.child.health.state.damage).toBe(1);
        expect(roleB.child.health.state.limit).toBe(30);

        expect(roleC.child.health.state.current).toBe(1);
        expect(roleC.child.death.state.status).toBe(DeathStatus.INACTIVE);
        expect(roleC.child.action.state.current).toBe(0);
    })


    test('wisp-attack-wisp', async () => {
        turn.next();

        const promise = roleD.child.action.run();
        await TimeUtil.sleep();
        const selector = SelectUtil.current;
        expect(selector).toBeDefined();
        if (!selector) return;
        expect(selector.options).toContain(roleA);
        expect(selector?.options).toContain(roleC);
        expect(selector?.options.length).toBe(2);
        SelectUtil.set(roleC);
        await promise;
        
        expect(roleC.child.health.state.current).toBe(0);
        expect(roleC.child.health.state.damage).toBe(1);
        expect(roleC.child.health.state.limit).toBe(1);
        expect(roleC.child.death.state.status).toBe(DeathStatus.ACTIVE);

        expect(roleD.child.health.state.current).toBe(0);
        expect(roleD.child.health.state.damage).toBe(1);
        expect(roleD.child.health.state.limit).toBe(1);
        expect(roleD.child.death.state.status).toBe(DeathStatus.ACTIVE);
        expect(roleD.child.action.state.current).toBe(0);

        expect(boardA.child.minions.length).toBe(0);
        expect(boardB.child.minions.length).toBe(0);

        expect(roleC.child.death.refer.reason).toBe(roleD.child.attack.child.damage);
        expect(roleD.child.death.refer.reason).toBe(roleC.child.attack.child.damage);
    })
})