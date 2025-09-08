import { BoardModel, GameModel, HandModel, MageModel, ManaModel, PlayerModel, WarriorModel } from "hearthstone-core";
import { boot } from "../common/boot";
import { WispModel } from "../wisp";
import { FieryWarAxeModel } from ".";

describe('firey-war-axe', () => {
    const game = boot(new GameModel(() => ({
        child: {
            playerA: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    character: new WarriorModel(),
                    hand: new HandModel(() => ({
                        child: { weapons: [new FieryWarAxeModel()] }
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
    const charA = playerA.child.character;
    const charB = playerB.child.character;
    const handA = playerA.child.hand;
    const roleA = charA.child.role;
    const roleB = charB.child.role;
    if (!roleA || !roleB) throw new Error();

    const weapon = handA.child.weapons.find(item => item instanceof FieryWarAxeModel);
    expect(weapon).toBeDefined();
    if (!weapon) throw new Error();

    test('fiery-war-axe-equip', async () => {
        expect(roleA.child.attack.state.current).toBe(0);
        expect(handA.child.weapons.length).toBe(1);
        expect(charA.child.weapon).toBeUndefined();
        await weapon.play();
        expect(handA.child.weapons.length).toBe(0);
        expect(charA.child.weapon).toBeDefined();
        expect(roleA.child.attack.state.current).toBe(3);
        expect(weapon?.child.attack.state.origin).toBe(3);
        expect(roleA.child.attack.state.origin).toBe(0);
        expect(roleA.child.attack.state.offset).toBe(3);
    })
})