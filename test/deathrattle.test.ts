// Test scenario:
// Initial setup: Player A has Leper Gnome on board, Player B has Wisp on board
// Test case: Player A's Leper Gnome attacks Player B's Wisp, both die, Player B loses 2 health
import { GameModel, BoardModel, MageModel, TimeUtil, SelectUtil, DeathStatus, ManaModel, PlayerModel, HandModel } from "../src";
import { LeperGnomeModel } from "./leper-gnome";
import { WispModel } from "./wisp";
import { boot } from "./boot";
import { DebugUtil, LogLevel } from "set-piece";

DebugUtil.level = LogLevel.ERROR;
describe('leper-gnome', () => {
    const game = boot(new GameModel({
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    character: new MageModel({}),
                    board: new BoardModel({
                        child: { 
                            minions: [new LeperGnomeModel({})] 
                        }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    character: new MageModel({}),
                    board: new BoardModel({
                        child: { minions: [new WispModel({})] }
                    })
                }
            }),
        }
    }));
    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const boardA = playerA.child.board;
    const boardB = playerB.child.board;
    const handA = playerA.child.hand;
    const handB = playerB.child.hand;
    const cardC = boardA.child.minions.find(item => item instanceof LeperGnomeModel);
    const cardD = boardB.child.minions.find(item => item instanceof WispModel);
    const roleC = cardC?.child.role;
    const roleD = cardD?.child.role;
    const roleB = playerB.child.character.child.role;
    if (!roleC || !roleD) throw new Error();

    test('leper-gnome-deathrattle', async () => {
        expect(boardA.child.minions.length).toBe(1);
        expect(boardB.child.minions.length).toBe(1);
        expect(roleC.state.attack).toBe(2);
        expect(roleC.state.health).toBe(1);
        expect(roleD.state.attack).toBe(1);
        expect(roleD.state.health).toBe(1);
        expect(roleB.state.health).toBe(30);
        
        // attack
        let promise = roleC.child.action.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleD);
        expect(SelectUtil.current?.options.length).toBe(2);
        SelectUtil.set(roleD);
        await promise;
        
        expect(boardA.child.minions.length).toBe(0);
        expect(boardB.child.minions.length).toBe(0);
        expect(roleC.child.death.state.status).toBe(DeathStatus.ACTIVE);
        expect(roleD.child.death.state.status).toBe(DeathStatus.ACTIVE);
        expect(roleB.state.health).toBe(28);
        expect(roleB.child.health.state.damage).toBe(2);
    })
})
