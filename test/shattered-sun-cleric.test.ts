import { BoardModel } from "@/common/container/board";
import { HandModel } from "@/common/container/hand";
import { GameModel } from "@/common/game";
import { MageHeroModel } from "@/common/hero/mage/hero";
import { PlayerModel } from "@/common/player";
import { ShatteredSunClericCardModel } from "@/extension/legacy/shattered-sun-cleric/card";
import { WispCardModel } from "@/extension/legacy/wisp/card";
import { AppService } from "@/service/app";
import { Selector } from "@/utils/selector";
import '@/index'
import { WispRoleModel } from "@/extension/legacy/wisp/role";

describe('shattered-sun-cleric', () => {
    test('start', async () => {
        const root = AppService.root;
        expect(root).toBeDefined();
        if (!root) return
        const game = new GameModel({
            child: {
                playerA: new PlayerModel({
                    child: {
                        hero: new MageHeroModel({}),
                        board: new BoardModel({
                            child: { cards: [new WispCardModel({})] }
                        }),
                        hand: new HandModel({
                            child: { cards: [new ShatteredSunClericCardModel({})] }
                        })
                    }
                }),
                playerB: new PlayerModel({
                    child: {
                        hero: new MageHeroModel({}),
                        hand: new HandModel({
                            child: { cards: [
                                new ShatteredSunClericCardModel({}),
                                new WispCardModel({})
                            ]}
                        })
                    }
                })
            }
        })
        root.start(game)
        const handA = game.child.playerA.child.hand;
        const handB = game.child.playerB.child.hand;
        expect(handA.child.cards.length).toBe(1);
        expect(handB.child.cards.length).toBe(2);
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        expect(boardA.child.cards.length).toBe(1);
        expect(boardB.child.cards.length).toBe(0);
    });


    test('battlecry', async () => {
        const root = AppService.root;
        const game = root?.child.game;
        expect(game).toBeDefined();
        if (!game) return;
        const handA = game.child.playerA.child.hand;
        const boardA = game.child.playerA.child.board;
        const clericCardA = handA.child.cards[0];
        const wispA = boardA.child.cards[0]?.child.role;
        expect(wispA).toBeDefined();
        expect(clericCardA).toBeDefined();
        if (!clericCardA || !wispA) return;
        expect(wispA.state.attack).toBe(1);
        expect(wispA.state.maxHealth).toBe(1);
        expect(wispA.state.curHealth).toBe(1);
        expect(wispA.state.tmpHealth).toBe(0);
        process.nextTick(() => {
            Selector.current?.set(wispA)
        })
        await clericCardA.prepare();
        expect(wispA.state.attack).toBe(2);
        expect(wispA.state.maxHealth).toBe(2);
        expect(wispA.state.curHealth).toBe(2);
        expect(wispA.state.tmpHealth).toBe(1);
    })

    test('summon', async () => {
        const root = AppService.root;
        const game = root?.child.game;
        expect(game).toBeDefined();
        if (!game) return;
        const handB = game.child.playerB.child.hand;
        const boardB = game.child.playerB.child.board;
        const clericCardB = handB.child.cards[0];
        const wispCardB = handB.child.cards[1];
        expect(clericCardB).toBeDefined();
        expect(wispCardB).toBeDefined();
        if (!clericCardB || !wispCardB) return;
        await clericCardB.prepare();
        expect(boardB.child.cards.length).toBe(1);
        expect(handB.child.cards.length).toBe(1);
        await wispCardB.prepare();
    })


    test('attack', async () => {
        const root = AppService.root;
        const game = root?.child.game;
        expect(game).toBeDefined();
        if (!game) return;
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const wispA = boardA.child.cards[0]?.child.role;
        const wispB = boardB.child.cards[1]?.child.role;
        expect(wispA).toBeDefined();
        expect(wispB).toBeDefined();
        expect(wispA instanceof WispRoleModel).toBe(true);
        expect(wispB instanceof WispRoleModel).toBe(true);
        if (!wispA || !wispB) return;
        expect(wispA.state.attack).toBe(2);
        expect(wispA.state.maxHealth).toBe(2);
        expect(wispA.state.curHealth).toBe(2);
        expect(wispA.state.tmpHealth).toBe(1);
        expect(wispB.state.attack).toBe(1);
        expect(wispB.state.maxHealth).toBe(1);
        expect(wispB.state.curHealth).toBe(1);
        expect(wispB.state.tmpHealth).toBe(0);
        wispA.attack(wispB);
        expect(wispA.state.attack).toBe(2);
        expect(wispA.state.maxHealth).toBe(2);
        expect(wispA.state.curHealth).toBe(1);
        expect(wispA.state.tmpHealth).toBe(1);
        expect(wispA.state.rawDamage).toBe(0);
        expect(wispA.state.tmpDamage).toBe(1);
        expect(wispB.state.attack).toBe(1);
        expect(wispB.state.maxHealth).toBe(1);
        expect(wispB.state.curHealth).toBe(-1);
        expect(wispB.state.tmpHealth).toBe(0);
        expect(wispB.state.rawDamage).toBe(2);
        expect(wispB.state.tmpDamage).toBe(0);
    })
})


