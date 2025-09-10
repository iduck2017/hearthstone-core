/**
 * Test cases for Goldshire Footman
 * 
 * 1. wisp-attack-goldshire-footman: Player A's Wisp can only attack Player B's Goldshire Footman due to taunt
 */

import { GameModel, PlayerModel, MageModel, BoardModel, TimeUtil, SelectUtil, ManaModel } from "hearthstone-core";
import { GoldshireFootmanModel } from ".";
import { WispModel } from "../wisp";
import { boot } from "../common/boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('goldshire-footman', () => {
    const game = new GameModel(() => ({
        child: {
            playerA: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [new WispModel()] }
                    }))
                }
            })),
            playerB: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [new GoldshireFootmanModel()] }
                    }))
                }
            }))
        }
    }));
    boot(game);
    const boardA = game.child.playerA.child.board;
    const boardB = game.child.playerB.child.board;
    const playerB = game.child.playerB;
    const cardC = boardA.child.minions.find((item: any) => item instanceof WispModel);
    const cardD = boardB.child.minions.find((item: any) => item instanceof GoldshireFootmanModel);
    const roleC = cardC?.child.role;
    const roleD = cardD?.child.role;
    const roleB = playerB.child.hero.child.role;
    if (!roleC || !roleD) throw new Error();

    test('wisp-attack-goldshire-footman', async () => {
        // Initial state verification
        expect(roleC.state.action).toBe(1); // Wisp has action point
        expect(roleD.child.entries.child.taunt.state.isActive).toBe(true);
        const promise = roleC.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleD);
        expect(SelectUtil.current?.options).not.toContain(roleB);
        SelectUtil.set(roleD);
        await promise;
        expect(roleD.state.health).toBe(1);
        expect(roleD.child.health.state.limit).toBe(2);
        expect(roleD.child.health.state.damage).toBe(1);
        expect(roleD.child.health.state.origin).toBe(2);
        expect(roleD.child.health.state.offset).toBe(0);
    })
}) 