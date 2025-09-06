/**
 * Test cases for Elven Archer
 * 
 * Requirements:
 * 1. start: Player B has a wisp on board by default, Player A has an elven archer in hand
 * 2. battlecry: Player A uses Elven Archer to attack the wisp
 */
import { BoardModel, GameModel, HandModel, MageModel, ManaModel, PlayerModel, SelectUtil, TimeUtil } from "../../src";
import { boot } from "../boot";
import { ElvenArcherModel } from ".";
import { WispModel } from "../wisp";

describe('battlecry', () => {
    const game = new GameModel(() => ({
        child: {
            playerA: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    character: new MageModel(),
                    hand: new HandModel(() => ({
                        child: { 
                            minions: [new ElvenArcherModel()] 
                        }
                    })),
                }
            })),
            playerB: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    character: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [new WispModel()] }
                    })),
                }
            })),
        }
    }));
    const root = boot(game);
    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const hand = game.child.playerA.child.hand;
    const board = game.child.playerB.child.board;
    const cardC = hand.child.minions.find(item => item instanceof ElvenArcherModel);
    const cardD = board.child.minions.find(item => item instanceof WispModel);
    const roleC = cardC?.child.role;
    const roleD = cardD?.child.role;
    const roleA = playerA.child.character.child.role;
    const roleB = playerB.child.character.child.role;
    if (!roleC || !roleD) throw new Error();

    test('elven-archer-battlecry', async () => {
        expect(roleD.state.health).toBe(1);

        // play elven archer
        const promise = cardC.play();
        expect(SelectUtil.current?.options).toContain(0);
        SelectUtil.set(0);
        await TimeUtil.sleep()
        expect(SelectUtil.current?.options).toContain(roleD);
        expect(SelectUtil.current?.options).toContain(roleA);
        expect(SelectUtil.current?.options).toContain(roleB);
        SelectUtil.set(roleD);
        await promise;

        expect(roleD.state.health).toBe(0);
        expect(roleD.child.health.state.damage).toBe(1);
        expect(roleD.child.health.state.limit).toBe(1);
        expect(roleD.child.health.state.current).toBe(0);
        expect(roleD.child.health.state.origin).toBe(1);
        expect(roleD.child.death.state.isActive).toBe(true);
        const reason = roleD.child.death.refer.reason;
        expect(reason?.route.card).toBe(cardC);
    })
})
