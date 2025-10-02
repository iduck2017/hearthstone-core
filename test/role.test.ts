import { GameModel, MageModel, PlayerModel, SelectUtil, TimeUtil } from "hearthstone-core";
import { boot } from "./boot";
import { HandModel } from "hearthstone-core";
import { DeckModel } from "hearthstone-core";
import { BoardModel } from "hearthstone-core";
import { WispModel } from "./wisp";

describe('role', () => {
    const game = new GameModel(() => ({
        child: {
            playerA: new PlayerModel(() => ({
                child: {
                    hero: new MageModel(),
                    hand: new HandModel(),
                    deck: new DeckModel(),
                    board: new BoardModel(() => ({
                        child: { 
                            minions: [new WispModel()]
                        }
                    })),
                }
            })),
            playerB: new PlayerModel(() => ({
                child: {
                    hero: new MageModel(),
                    hand: new HandModel(),
                    deck: new DeckModel(),
                    board: new BoardModel(() => ({
                        child: { 
                            minions: [new WispModel()]
                        }
                    })),
                }
            })),
        }
    }));
    boot(game)
    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const boardA = playerA.child.board;
    const boardB = playerB.child.board;
    const cardC = boardA.child.minions.find(item => item instanceof WispModel);
    const cardD = boardB.child.minions.find(item => item instanceof WispModel);
    const roleC = cardC?.child.role;
    const roleD = cardD?.child.role;
    const roleA = playerA.child.hero.child.role;
    const roleB = playerB.child.hero.child.role;
    const turn = game.child.turn;
    if (!roleC || !roleD) throw new Error()

    test('initial-state', () => {
        // roleB
        expect(roleD.child.action.state.current).toBe(1);
        // roleA
        expect(roleC.child.action.state.current).toBe(1);
        expect(roleC.child.health.state.current).toBe(1);
        expect(roleC.child.health.state.damage).toBe(0);
        expect(roleC.child.health.state.origin).toBe(1);
        expect(roleC.child.attack.state.current).toBe(1);
        expect(cardC.child.dispose.status).toBe(false);
    })

    test('wisp-attack', async () => {
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
        expect(roleB.child.health.state.origin).toBe(30);

        expect(roleC.child.health.state.current).toBe(1);
        expect(cardC.child.dispose.status).toBe(false);
        expect(roleC.child.action.state.current).toBe(0);
    })

    test('wisp-attack-2', async () => {
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
        expect(roleC.child.health.state.origin).toBe(1);
        expect(cardC.child.dispose.status).toBe(true);

        expect(roleD.child.health.state.current).toBe(0);
        expect(roleD.child.health.state.damage).toBe(1);
        expect(roleD.child.health.state.origin).toBe(1);
        expect(cardD.child.dispose.status).toBe(true);
        expect(roleD.child.action.state.current).toBe(0);

        expect(boardA.child.minions.length).toBe(0);
        expect(boardB.child.minions.length).toBe(0);
        expect(cardC.child.dispose.refer.source).toBe(cardD);
        expect(cardD.child.dispose.refer.source).toBe(cardC);
    })
})