import { AppService } from "@/service/app"
import { WispCardModel } from "@/extension/legacy/wisp/card";
import { GameModel } from "@/common/game";
import { PlayerModel } from "@/common/player";
import { HandModel } from "@/common/container/hand";
import { MageHeroModel } from "@/common/hero/mage/hero";
import { BoardModel } from "@/common/container/board";
import { RoleModel } from "@/common/role";
import '@/index'

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
    })

    test('summon', async () => {
        const root = AppService.root;
        const game = root?.child.game;
        if (!game) return;
        const handA = game.child.playerA.child.hand;
        const handB = game.child.playerB.child.hand;
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        expect([
            handA.child.cards.length,
            handB.child.cards.length,
            boardA.child.cards.length,
            boardB.child.cards.length,
        ]).toEqual([1, 0, 0, 1]);
        const card = handA.child.cards[0];
        await card?.preparePlay();
        expect([
            handA.child.cards.length,
            handB.child.cards.length,
            boardA.child.cards.length,
            boardB.child.cards.length,
        ]).toEqual([0, 0, 1, 1]);
    })

    test('attack', () => {
        const root = AppService.root;
        const game = root?.child.game;
        if (!game) return;
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const roleA = boardA.child.cards[0]?.child.role;
        const roleB = boardB.child.cards[0]?.child.role;
        if (!roleA || !roleB) return;
        let state: RoleModel['state'] = {
            attack: 1,
            health: 1,
            modAttack: 0,
            modHealth: 0,
            refHealth: 1,
            damage: 0,
            maxHealth: 1,
            curHealth: 1,
            curAttack: 1,
        }
        expect(roleA.state).toEqual(state);
        expect(roleB.state).toEqual(state);
        roleA.attack(roleB);
        state = {
            ...state,
            damage: 1,
            curHealth: 0,
            maxHealth: 1,
        }
        expect(roleA.state).toEqual(state);
        expect(roleB.state).toEqual(state);
    })
})