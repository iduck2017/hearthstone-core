import { BoardModel, GameModel, MageModel, ManaModel, PlayerModel, SelectUtil, TimeUtil, WarriorModel } from "hearthstone-core";
import { boot } from "./boot";
import { WispModel } from "../wisp";

describe('skill', () => {
    const game = boot(new GameModel(() => ({
        child: {
            playerA: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    character: new MageModel(),
                }
            })),
            playerB: new PlayerModel(() => ({
                child: {
                    mana: new ManaModel(() => ({ state: { origin: 10 }})),
                    character: new WarriorModel(),
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

    test('fireblast', async () => {
        expect(roleA.state.health).toBe(30);
        expect(roleB.state.health).toBe(30);
        expect(playerA.child.mana.state.current).toBe(10);

        const promise = charA.child.skill.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleB);
        expect(SelectUtil.current?.options).toContain(roleA);
        SelectUtil.set(roleB);
        await promise;

        expect(roleB.state.health).toBe(29);
        expect(playerA.child.mana.state.current).toBe(8);
    })
})