/**
 * Test cases for Stonetusk Boar
 * 
 * 1. stonetusk-boar-charge: Player A plays Stonetusk Boar and immediately attacks enemy hero
 */

import { GameModel, BoardModel, HandModel, MageModel, PlayerModel, TimeUtil, SelectUtil, ManaModel } from "hearthstone-core";
import { StonetuskBoarModel } from "./index";
import { WispModel } from "../wisp";
import { boot } from "../common/boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('stonetusk-boar', () => {
    const game = new GameModel(() => ({
        child: {
            playerA: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    character: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [] }
                    })),
                    hand: new HandModel(() => ({
                        child: { minions: [new StonetuskBoarModel()] }
                    }))
                }
            })),
            playerB: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    character: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [new WispModel()] }
                    })),
                    hand: new HandModel(() => ({
                        child: { minions: [] }
                    }))
                }
            }))
        }
    }));
    boot(game);
    
    const boardA = game.child.playerA.child.board;
    const boardB = game.child.playerB.child.board;
    const handA = game.child.playerA.child.hand;
    const cardC = handA.child.minions.find(item => item instanceof StonetuskBoarModel);
    const cardD = boardB.child.minions.find(item => item instanceof WispModel);
    const roleC = cardC?.child.role;
    const roleD = cardD?.child.role;
    const roleB = game.child.playerB.child.character.child.role;
    if (!roleC || !roleD) throw new Error();

    test('stonetusk-boar-charge', async () => {
        expect(boardA.child.minions.length).toBe(0);
        expect(boardB.child.minions.length).toBe(1);
        expect(roleB.state.health).toBe(30);
        
        // Play Stonetusk Boar
        let promise = cardC.play();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await promise;
        expect(boardA.child.minions.length).toBe(1);
        expect(roleC.state.attack).toBe(1);
        expect(roleC.state.health).toBe(1);
        expect(roleC.state.action).toBe(1);
        expect(roleC.child.action.state.isActive).toBe(true);
        
        // Boar directly attacks enemy hero
        promise = roleC.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleB);
        expect(SelectUtil.current?.options.length).toBe(2);
        SelectUtil.set(roleB);
        await promise;
        
        expect(roleC.state.action).toBe(0);
        expect(roleB.state.health).toBe(29);
        expect(roleB.child.health.state.damage).toBe(1);
    })
}) 