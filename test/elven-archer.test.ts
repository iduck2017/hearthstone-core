/**
 * Test cases for Elven Archer
 * 
 * Requirements:
 * 1. start: Player B has a wisp on board by default, Player A has an elven archer in hand
 * 2. battlecry: Player A uses Elven Archer to attack the wisp
 */

import { BoardModel } from "@/common/container/board";
import { HandModel } from "@/common/container/hand";
import { GameModel } from "@/common/game";
import { MageHeroModel } from "@/common/hero/mage/hero";
import { PlayerModel } from "@/common/player";
import { ElvenArcherCardModel } from "@/extension/legacy/elven-archer/card";
import { WispCardModel } from "@/extension/legacy/wisp/card";
import { AppService } from "@/service/app";
import { Selector } from "@/utils/selector";
import { RoleModel } from "@/common/role";
import '@/index'

describe('elven-archer', () => {
    test('start', async () => {
        const root = AppService.root;
        expect(root).toBeDefined();
        if (!root) return
        const game = new GameModel({
            child: {
                playerA: new PlayerModel({
                    child: {
                        hero: new MageHeroModel({}),
                        hand: new HandModel({
                            child: { cards: [new ElvenArcherCardModel({})] }
                        })
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
    });

    test('battlecry', async () => {
        const root = AppService.root;
        const game = root?.child.game;
        expect(game).toBeDefined();
        if (!game) return;
        const hand = game.child.playerA.child.hand;
        const board = game.child.playerB.child.board;
        const cardA = hand.child.cards.find(item => item instanceof ElvenArcherCardModel);
        const cardB = board.child.cards.find(item => item instanceof WispCardModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        if (!cardA || !cardB) return;
        
        // Initial state of the wisp
        let state = {
            attack: 1,
            health: 1,
            modAttack: 0,
            modHealth: 0,
            damage: 0,
            maxHealth: 1,
            curHealth: 1,
            curAttack: 1,
        }
        const role = cardB.child.role;
        expect(role.state).toMatchObject(state);
        
        // Use Elven Archer to deal 1 damage to the wisp
        process.nextTick(() => {
            Selector.current?.set(role)
        })
        await cardA.preparePlay();
        
        // State after battlecry: wisp takes 1 damage
        expect(role.state).toMatchObject({
            ...state,
            damage: 1,          // 1 damage taken from battlecry
            curHealth: 0,       // current health reduced to 0
        });
    })
})
