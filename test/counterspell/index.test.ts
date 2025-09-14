/**
 * Test cases for Fireball
 * 
 * 1. fireball-damage: Player A plays Fireball and deals 6 damage to Player B's hero
 * 2. fireball-minion: Player A plays Fireball and deals 6 damage to a minion
 */
import { GameModel, PlayerModel, MageModel, BoardModel, HandModel, SelectUtil, ManaModel } from "hearthstone-core";
import { WispModel } from "../wisp";
import { boot } from "../common/boot";
import { DebugUtil, LogLevel } from "set-piece";
import { CounterspellModel } from ".";
import { FireballModel } from "../fireball";

DebugUtil.level = LogLevel.ERROR;
describe('fireball', () => {
    const game = new GameModel(() => ({
        child: {
            playerA: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [] }
                    })),
                    hand: new HandModel(() => ({
                        child: { spells: [new CounterspellModel()] }
                    }))
                }
            })),
            playerB: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [new WispModel()] }
                    })),
                    hand: new HandModel(() => ({
                        child: { spells: [new FireballModel()] }
                    }))
                }
            }))
        }
    }));
    boot(game);
    
    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const handA = playerA.child.hand;
    const handB = playerB.child.hand;
    const heroA = playerA.child.hero;
    const heroB = playerB.child.hero;
    const roleA = heroA.child.role;
    const roleB = heroB.child.role;
    const spellC = handA.child.spells.find(item => item instanceof CounterspellModel);
    const spellD = handB.child.spells.find(item => item instanceof FireballModel);
    if (!spellC || !spellD) throw new Error();
    const boardA = game.child.playerA.child.board;
    const turn = game.child.turn;

    test('counterspell-cast', async () => {
        expect(boardA.child.secrets.length).toBe(0);
        await spellC.play();
        expect(boardA.child.secrets.length).toBe(1);
    })


    test('counterspell-trigger', async () => {
        turn.next();
        let promise = spellD.play();
        expect(SelectUtil.current?.options).toContain(roleA);
        expect(SelectUtil.current?.options).toContain(roleB);
        SelectUtil.set(roleA);
        await promise;
        expect(handB.child.spells.length).toBe(0);
        expect(playerB.child.mana.state.current).toBe(6);
        expect(roleA.child.health.state.current).toBe(30);
        expect(boardA.child.secrets.length).toBe(0);
    })

})
