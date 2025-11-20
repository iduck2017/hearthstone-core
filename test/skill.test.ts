import { BoardModel, GameModel, MageModel, ManaModel, PlayerModel, AnimeUtil, WarriorModel } from "../src";
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
                        child: { cards: [new WispModel()] }
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
    const heroA = playerA.child.hero;
    const heroB = playerB.child.hero;
    if (!heroA || !heroB) throw new Error();

    test('fireblast', async () => {
        expect(heroA.child.health.state.current).toBe(30);
        expect(heroB.child.health.state.current).toBe(30);
        expect(playerA.child.mana.state.current).toBe(10);

        const promise = heroA.child.skill.use();
        expect(playerA.child.controller.current?.options).toContain(heroB);
        expect(playerA.child.controller.current?.options).toContain(heroA);
        playerA.child.controller.set(heroB);
        await promise;

        expect(heroB.child.health.state.current).toBe(29);
        expect(playerA.child.mana.state.current).toBe(8);
    })
})