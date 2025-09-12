import { BoardModel, GameModel, HandModel, MageModel, ManaModel, PlayerModel, SelectUtil, WarriorModel } from "hearthstone-core";
import { boot } from "../common/boot";
import { WispModel } from "../wisp";
import { FieryWarAxeModel } from ".";

describe('firey-war-axe', () => {
    const game = boot(new GameModel(() => ({
        child: {
            playerA: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new WarriorModel(),
                    hand: new HandModel(() => ({
                        child: { weapons: [new FieryWarAxeModel()] }
                    })),
                }
            })),
            playerB: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    hero: new MageModel(),
                    board: new BoardModel(() => ({
                        child: { minions: [new WispModel()] }
                    })),
                }
            })),
        }
    })));
    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const charA = playerA.child.hero;
    const charB = playerB.child.hero;
    const handA = playerA.child.hand;
    const boardB = playerB.child.board;
    const cardC = boardB.child.minions.find(item => item instanceof WispModel);
    const roleC = cardC?.child.role;
    const roleA = charA.child.role;
    const roleB = charB.child.role;
    if (!roleC) throw new Error();
    const turn = game.child.turn;

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


    test('warrior-attack', async () => {
        const promise = roleA.child.action.run();
        expect(SelectUtil.current).toBeDefined();
        expect(SelectUtil.current?.options).toContain(roleC);
        expect(SelectUtil.current?.options).toContain(roleB);
        SelectUtil.set(roleC);
        await promise;

        expect(cardC.child.dispose.state.isActive).toBe(true);
        expect(roleC.child.health.state.current).toBe(-2);
        expect(roleC.child.health.state.damage).toBe(3);

        expect(roleA.child.health.state.current).toBe(29);
        expect(roleA.child.health.state.damage).toBe(1);

        expect(weapon.child.action.state.current).toBe(1);
        expect(weapon.child.action.state.reduce).toBe(1);
        expect(weapon.child.action.state.origin).toBe(2);

        expect(boardB.child.minions.length).toBe(0);
        expect(boardB.refer.order.length).toBe(0);
    })

    test('fiery-war-axe-deactive', () => {
        expect(weapon.child.attack.state.isActive).toBe(true);
        expect(roleA.child.attack.state.current).toBe(3);
        turn.next();
        expect(turn.refer.current).toBe(playerB);
        expect(weapon.child.attack.state.isActive).toBe(false);
        expect(roleA.child.attack.state.current).toBe(0);
    }) 

    test('warrior-attack-2', async () => {
        turn.next();
        expect(weapon.child.attack.state.isActive).toBe(true);
        expect(roleA.child.action.state.isActive).toBe(true);

        const promise = roleA.child.action.run();
        expect(SelectUtil.current).toBeDefined();
        expect(SelectUtil.current?.options).toContain(roleB);
        SelectUtil.set(roleB);
        await promise;

        expect(roleB.child.health.state.current).toBe(27);
        expect(roleB.child.health.state.damage).toBe(3);

        expect(weapon.child.dispose.state.isActive).toBe(true);
        expect(weapon.child.action.state.current).toBe(0);
        expect(charA.child.weapon).toBeUndefined();
        
        expect(roleA.child.attack.state.current).toBe(0);
    })
})