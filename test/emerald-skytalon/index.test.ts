/**
 * Test cases for Emerald Skytalon
 * 
 * 1. emerald-skytalon-rush: Player A plays 2 emerald skytalons, they can attack immediately but only target wisps
 * 2. wisp-play: Player A plays a wisp, it can not attack immediately
 * 3. emerald-skytalon-attack: After 2 turns, the other emerald can attack the hero
 * 4. wisp-attack: Player B plays a wisp, it can attack immediately
 */

import { GameModel, PlayerModel, MageModel, HandModel, BoardModel, SelectUtil, TimeUtil, ActionModel, ManaModel } from "hearthstone-core";
import { EmeraldSkytalonModel } from "./index";
import { WispModel } from "../wisp";
import { boot } from "../common/boot";
import { DebugUtil, LogLevel } from "set-piece";

describe('emerald-skytalon', () => {
    const game = new GameModel(() => ({
        child: {
            playerA: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    hand: new HandModel(() => ({
                        child: { minions: [new EmeraldSkytalonModel(), new WispModel()] }
                    })),
                }
            })),
            playerB: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [new WispModel()]}
                    })),
                }
            }))
        }
    }))
    boot(game);

    const handA = game.child.playerA.child.hand;
    const boardA = game.child.playerA.child.board;
    const boardB = game.child.playerB.child.board;
    const cardC = handA.child.minions.find(item => item instanceof EmeraldSkytalonModel);
    const cardD = handA.child.minions.find(item => item instanceof WispModel);
    const cardE = boardB.child.minions.find(item => item instanceof WispModel);
    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const roleB = playerB.child.hero.child.role;
    const roleC = cardC?.child.role;
    const roleD = cardD?.child.role;
    const roleE = cardE?.child.role;
    if (!roleC || !roleD || !roleE) throw new Error();
    const turn = game.child.turn;

    test('emerald-skytalon-rush', async () => {
        let promise = cardC.play()
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await promise;

        expect(boardA.child.minions.length).toBe(1);
        expect(turn.refer.current).toBe(playerA);
        expect(roleC.state.attack).toBe(2);
        expect(roleC.state.health).toBe(1);
        expect(roleC.state.action).toBe(1);
        expect(roleC.child.sleep.state.isActive).toBe(true);
        expect(roleC.child.entries.child.rush.state.isActive).toBe(true)
        promise = roleC.child.action.run()
        await TimeUtil.sleep();

        expect(SelectUtil.current?.options).toContain(roleE);
        expect(SelectUtil.current?.options).not.toContain(roleB);
        SelectUtil.set(undefined);
        await promise;
        expect(roleC.state.action).toBe(1);        
    })


    test('wisp-play', async () => {
        let promise = cardD.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(1);
        SelectUtil.set(1);
        await promise;

        expect(boardA.child.minions.length).toBe(2);
        expect(roleD.state.action).toBe(1);
        expect(roleD.child.sleep.state.isActive).toBe(true);
        expect(roleD.child.entries.child.rush.state.isActive).toBe(false);

        // Wisp can not attack immediately
        promise = roleD.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeUndefined();
    })


    test('emerald-skytalon-attack', async () => {
        const turn = game.child.turn;
        const playerA = game.child.playerA;
        const playerB = game.child.playerB;
        expect(turn.refer.current).toBe(playerA);
        await turn.next();
        expect(turn.refer.current).toBe(playerB);
        await turn.next();
        expect(turn.refer.current).toBe(playerA);

        expect(roleC.child.sleep.state.isActive).toBe(false);
        expect(roleC.state.action).toBe(1);
        expect(roleC.child.entries.child.rush.state.isActive).toBe(true);
        expect(roleD.child.sleep.state.isActive).toBe(false);
        expect(roleD.state.action).toBe(1);
        expect(roleD.child.entries.child.rush.state.isActive).toBe(false);

        let promise = roleC.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleE);
        expect(SelectUtil.current?.options).toContain(roleB);
        SelectUtil.set(roleB);
        await promise;

        expect(roleB.state.health).toBe(28);
        expect(roleC.state.action).toBe(0);
    });

    test('wisp-attack', async () => {
        // Wisp attack
        const promise = roleD.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleE);
        expect(SelectUtil.current?.options).toContain(roleB);
        SelectUtil.set(roleB);
        await promise;

        expect(roleB.state.health).toBe(27);
        expect(roleC.state.action).toBe(0);
    })
})
