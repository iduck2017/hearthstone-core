import { BoardModel, DeckModel, GameModel, HandModel, MageModel, PlayerModel } from "../src";
import { boot } from "./boot";
import { WispModel } from "./wisp";

describe('role', () => {
    const game = new GameModel({
        state: { debug: { isDrawDisabled: true } },
        child: {
            playerA: new PlayerModel({
                child: {
                    hero: new MageModel(),
                    hand: new HandModel(),
                    deck: new DeckModel(),
                    board: new BoardModel({
                        child: { cards: [new WispModel()] }
                    }),
                }
            }),
            playerB: new PlayerModel({
                child: {
                    hero: new MageModel(),
                    hand: new HandModel(),
                    deck: new DeckModel(),
                    board: new BoardModel({
                        child: { cards: [new WispModel()] }
                    }),
                }
            }),
        }
    });
    boot(game)
    const playerA = game.child.playerA;
    const playerB = game.child.playerB;
    const boardA = playerA.child.board;
    const boardB = playerB.child.board;
    const cardC = boardA.child.cards.find(item => item instanceof WispModel);
    const cardD = boardB.child.cards.find(item => item instanceof WispModel);
    const turn = game.child.turn;
    const heroA = playerA.child.hero;
    const heroB = playerB.child.hero;
    if (!cardC || !cardD) throw new Error()

    test('initial-state', () => {
        // roleB
        expect(cardD.child.attack.state.current).toBe(1);
        // roleA
        expect(cardC.child.attack.state.current).toBe(1);
        expect(cardC.child.health.state.current).toBe(1);
        expect(cardC.child.health.state.damage).toBe(0);
        expect(cardC.child.health.state.maximum).toBe(1);
        expect(cardC.child.dispose.state.isActived).toBe(false);
    })

    test('wisp-attack', async () => {
        const promise = cardC.child.action.run();
        const selector = playerA.controller.current;
        expect(selector).toBeDefined();
        if (!selector) return;
        expect(selector.options).toContain(heroB);
        expect(selector?.options).toContain(cardD);
        expect(selector?.options.length).toBe(2);
        playerA.controller.set(heroB);
        await promise;

        expect(heroB.child.health.state.current).toBe(29);
        expect(heroB.child.health.state.damage).toBe(1);
        expect(heroB.child.health.state.maximum).toBe(30);

        expect(cardC.child.health.state.current).toBe(1);
        expect(cardC.child.dispose.state.isActived).toBe(false);
        expect(cardC.child.action.state.current).toBe(0);
    })

    test('wisp-attack', async () => {
        turn.next();

        const promise = cardD.child.action.run();
        const selector = playerB.controller.current;
        expect(selector).toBeDefined();
        if (!selector) return;
        expect(selector.options).toContain(heroA);
        expect(selector?.options).toContain(cardC);
        expect(selector?.options.length).toBe(2);
        playerB.controller.set(cardC);
        await promise;
        
        expect(cardC.child.health.state.current).toBe(0);
        expect(cardC.child.health.state.damage).toBe(1);
        expect(cardC.child.health.state.maximum).toBe(1);
        expect(cardC.child.dispose.state.isActived).toBe(true);

        expect(cardD.child.health.state.current).toBe(0);
        expect(cardD.child.health.state.damage).toBe(1);
        expect(cardD.child.health.state.maximum).toBe(1);
        expect(cardD.child.dispose.state.isActived).toBe(true);
        expect(cardD.child.action.state.current).toBe(0);

        expect(boardA.child.cards.length).toBe(0);
        expect(boardB.child.cards.length).toBe(0);
        expect(cardC.child.dispose.refer.source).toBe(cardD);
        expect(cardD.child.dispose.refer.source).toBe(cardC);
    })
})