import { BoardModel, GameModel, MageModel, ManaModel, PlayerModel, SelectUtil, TimeUtil, WarriorModel } from "hearthstone-core";
import { boot } from "../common/boot";
import { WispModel } from "../wisp";
import { FieryWarAxeModel } from ".";

describe('firey-war-axe', () => {
    const game = boot(new GameModel(() => ({
        child: {
            playerA: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    character: new WarriorModel(() => ({
                        child: { weapon: new FieryWarAxeModel() }   
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
    })));
    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const boardA = playerA.child.board;
    const boardB = playerB.child.board;
    const handA = playerA.child.hand;
    const handB = playerB.child.hand;
    const charA = playerA.child.character;
    const charB = playerB.child.character;
    const roleA = charA.child.role;
    const roleB = charB.child.role;
    if (!roleA || !roleB) throw new Error();

    test('fiery-war-axe-equip', () => {
        
    })

    test('warrior-attack', async () => {
        const weapon = charA.child.weapon;
        expect(charA.child.weapon).toBeDefined();
        expect(weapon?.child.attack.state.origin).toBe(3);
        expect(roleA.child.attack.state.current).toBe(3);
    })
})