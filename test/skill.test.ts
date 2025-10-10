import { BoardModel, GameModel, MageModel, ManaModel, PlayerModel, SelectUtil, TimeUtil, WarriorModel } from "hearthstone-core";
import { WispModel } from "./wisp";
import { boot } from "./boot";

describe('skill', () => {
    const game = boot(new GameModel({
        state: { debug: { isDrawDisabled: true } },
        child: {
            playerA: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new MageModel(),
                }
            }),
            playerB: new PlayerModel({
                child: {
                    mana: new ManaModel({ state: { origin: 10 }}),
                    hero: new WarriorModel({}),
                    board: new BoardModel({
                        child: { minions: [new WispModel()] }
                    }),
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
    const charA = playerA.child.hero;
    const charB = playerB.child.hero;
    const roleA = charA.child.role;
    const roleB = charB.child.role;
    if (!roleA || !roleB) throw new Error();

    test('fireblast', async () => {
        expect(roleA.child.health.state.current).toBe(30);
        expect(roleB.child.health.state.current).toBe(30);
        expect(playerA.child.mana.state.current).toBe(10);

        const promise = charA.child.skill.run();
        await TimeUtil.sleep();
        expect(SelectUtil.current?.options).toContain(roleB);
        expect(SelectUtil.current?.options).toContain(roleA);
        SelectUtil.set(roleB);
        await promise;

        expect(roleB.child.health.state.current).toBe(29);
        expect(playerA.child.mana.state.current).toBe(8);
    })
})