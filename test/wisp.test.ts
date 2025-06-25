import { RootModel } from "@/common/root";
import { LegacyExtensionModel } from "@/extension/legacy";
import { AppService } from "@/service/app"
import { WispCardModel } from "@/extension/legacy/wisp/card";
import '@/index'
import { GameModel } from "@/common/game";
import { PlayerModel } from "@/common/player";
import { HandModel } from "@/common/container/hand";
import { MageHeroModel } from "@/common/hero/mage/hero";
import { BoardModel } from "@/common/container/board";

describe('wisp', () => {
    test('start', () => {
        const root = AppService.root;
        expect(root).toBeDefined();
        if (!root) return
        const game = new GameModel({
            child: {
                playerA: new PlayerModel({
                    child: {
                        hero: new MageHeroModel({}),
                        hand: new HandModel({
                            child: { cards: [new WispCardModel({})] }
                        }),
                    }
                }),
                playerB: new PlayerModel({
                    child: {
                        hero: new MageHeroModel({}),
                        board: new BoardModel({
                            child: { cards: [new WispCardModel({})] }
                        })
                    }
                })
            }
        })
        root.start(game)
        const handA = game.child.playerA.child.hand;
        expect(handA.child.cards.length).toBe(1);
        const boardB = game.child.playerB.child.board;
        expect(boardB.child.cards.length).toBe(1);
    })

    test('summon', async () => {
        const root = AppService.root;
        const game = root?.child.game;
        if (!game) return;

        const handA = game.child.playerA.child.hand;
        const boardA = game.child.playerA.child.board;
        expect(handA.child.cards.length).toBe(1);
        expect(boardA.child.cards.length).toBe(0);
        const wispA = handA.child.cards[0];
        await wispA?.prepare();
        expect(handA.child.cards.length).toBe(0);
        expect(boardA.child.cards.length).toBe(1);
    })

    test('attack', () => {
        const root = AppService.root;
        const game = root?.child.game;
        if (!game) return;
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const wispA = boardA.child.cards[0]?.child.role;
        const wispB = boardB.child.cards[0]?.child.role;
        if (!wispA || !wispB) return;
        expect(wispA.state.attack).toBe(1);
        expect(wispA.state.maxHealth).toBe(1);
        expect(wispA.state.curHealth).toBe(1);
        expect(wispB.state.attack).toBe(1);
        expect(wispB.state.maxHealth).toBe(1);
        expect(wispB.state.curHealth).toBe(1);
        wispA.attack(wispB);
        expect(wispA.state.attack).toBe(1);
        expect(wispA.state.rawDamage).toBe(1);
        expect(wispA.state.maxHealth).toBe(1);
        expect(wispA.state.curHealth).toBe(0);
        expect(wispB.state.attack).toBe(1);
        expect(wispB.state.rawDamage).toBe(1);
        expect(wispB.state.maxHealth).toBe(1);
        expect(wispB.state.curHealth).toBe(0);
    })
})