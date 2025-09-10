/**
 * Test cases for Voodoo Doctor
 * 
 * 1. wisp-attack-shieldbearer: Player A's Wisp attacks Player B's hero
 * 2. voodoo-doctor-battlecry: Player A plays Voodoo Doctor and heals Player B's hero
 */

import { GameModel, BoardModel, HandModel, MageModel, PlayerModel, TimeUtil, SelectUtil, ManaModel } from "hearthstone-core";
import { DebugUtil, LogLevel } from "set-piece";
import { boot } from "../common/boot";
import { WispModel } from "../wisp";
import { VoodooDoctorModel } from ".";

describe('voodoo-doctor', () => {
    const game = new GameModel(() => ({
        child: {
            playerA: new PlayerModel(() => ({
                child: {
                    character: new MageModel(),
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    board: new BoardModel(() => ({
                        child: { minions: [new WispModel()] }
                    })),
                    hand: new HandModel(() => ({
                        child: { minions: [new VoodooDoctorModel()] }
                    }))
                }
            })),
            playerB: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    character: new MageModel(),
                }
            }))
        }
    }));
    boot(game)
    const turn = game.child.turn;
    const boardA = game.child.playerA.child.board;
    const handA = game.child.playerA.child.hand;
    const cardC = boardA.child.minions.find(item => item instanceof WispModel);
    const cardD = handA.child.minions.find(item => item instanceof VoodooDoctorModel);
    const roleC = cardC?.child.role;
    const roleD = cardD?.child.role;
    const playerB = game.child.playerB;
    const playerA = game.child.playerA;
    const roleA = playerA.child.character.child.role;
    const roleB = playerB.child.character.child.role;
    if (!roleC || !roleD) throw new Error();

    test('wisp-attack-shieldbearer', async () => {
        expect(boardA.child.minions.length).toBe(1);
        
        // Wisp attacks Shieldbearer
        let promise = roleC.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current).toBeDefined();
        expect(SelectUtil.current?.options).toContain(roleB);
        expect(SelectUtil.current?.options.length).toBe(1);
        SelectUtil.set(roleB);
        await promise;
        
        expect(roleB.state.health).toBe(29);
        expect(roleB.child.health.state.damage).toBe(1);
    })

    test('voodoo-doctor-battlecry', async () => {
        // Play Voodoo Doctor
        let promise = cardD.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await TimeUtil.sleep();
        
        expect(SelectUtil.current?.options).toContain(roleA);
        expect(SelectUtil.current?.options).toContain(roleB);
        expect(SelectUtil.current?.options).toContain(roleC);
        expect(SelectUtil.current?.options.length).toBe(3);
        SelectUtil.set(roleB);
        await promise;
        
        expect(roleB.state.health).toBe(30);
        expect(roleB.child.health.state.damage).toBe(0);
    })
}) 