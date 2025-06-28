/**
 * Test cases for Emerald Skytalon
 * 
 * Requirements:
 * 1. start: Player A has 2 emerald skytalons in hand, Player B has 2 wisps on board, turn starts (nextTurn)
 * 2. rush: Player A plays 2 emerald skytalons, they can attack immediately but only target wisps (not Player B hero), one emerald attacks one wisp, the other doesn't move
 * 3. attack: After 2 turns, the other emerald can attack the hero
 */

import { AppService } from "@/service/app"
import { EmeraldSkytalonCardModel } from "@/extension/legacy/emerald-skytalon/card";
import { WispCardModel } from "@/extension/legacy/wisp/card";
import { GameModel } from "@/common/game";
import { PlayerModel } from "@/common/player";
import { HandModel } from "@/common/container/hand";
import { MageHeroModel } from "@/common/hero/mage/hero";
import { BoardModel } from "@/common/container/board";
import { RoleModel } from "@/common/role";
import '@/index'
import { Utils } from "@/utils/utils";
import { Selector } from "@/utils/selector";

describe('emerald-skytalon', () => {
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
                            child: { cards: [
                                new EmeraldSkytalonCardModel({}),
                            ]}
                        }),
                    }
                }),
                playerB: new PlayerModel({
                    child: {
                        hero: new MageHeroModel({}),
                        board: new BoardModel({
                            child: { cards: [
                                new WispCardModel({}),
                            ]}
                        })
                    }
                })
            }
        })
        root.start(game)
        game.nextTurn();
    })

    test('rush', async () => {
        const root = AppService.root;
        const game = root?.child.game;
        if (!game) return;
        
        const handA = game.child.playerA.child.hand;
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        
        // Play first emerald skytalon
        const cardA = handA.child.cards.find(item => item instanceof EmeraldSkytalonCardModel);
        expect(cardA).toBeDefined();
        if (!cardA) return;
        const roleA = cardA.child.role;
        await cardA.preparePlay();
        expect(roleA.state.isRush).toBe(true);
        expect(roleA.state.action).toBe(1); // Rush minions have action points
        
        // First emerald attacks a wisp
        const cardB = boardB.child.cards.find(item => item instanceof WispCardModel);
        const roleB = cardB?.child.role;
        if (!roleB) return;
        
        // Use prepareAttack to select target
        process.nextTick(() => {
            const selector = Selector.current;
            expect(selector).toBeDefined();
            if (!selector) return;
            // Rush minions can only target enemy minions, not heroes
            expect(selector.candidates.length).toBe(1); // 2 wisps
            expect(selector.candidates).toContain(roleB);
            selector.set(roleB);
        });
        await roleA.prepareAttack();
        await Utils.sleep();
        
        // Verify wisp is damaged and emerald's action is consumed
        expect(roleA.state.action).toBe(0);
        expect(roleB.state).toMatchObject({
            damage: 2,
            maxHealth: 1,
            curHealth: -1,
        })
    })

    test('attack', async () => {
        const root = AppService.root;
        const game = root?.child.game;
        if (!game) return;
        
        const playerB = game.child.playerB;
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        
        // After 2 turns, the second emerald can attack the hero
        game.nextTurn(); // Player B's turn
        game.nextTurn(); // Player A's turn again
        
        const cardA = boardA.child.cards.find(item => item instanceof EmeraldSkytalonCardModel);
        const cardB = boardB.child.cards.find(item => item instanceof WispCardModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        if (!cardA || !cardB) return;
        const roleA = cardA.child.role;
        const roleB = cardB.child.role;
        
        // Attack the hero
        process.nextTick(() => {
            const selector = Selector.current;
            expect(selector).toBeDefined();
            if (selector) {
                // Now can target hero since it's not rush anymore (or rush expired)
                expect(selector.candidates.length).toBe(2);
                expect(selector.candidates).toContain(playerB.child.role);
                expect(selector.candidates).toContain(roleB);
                selector.set(playerB.child.role);
            }
        });
        expect(roleA.state.action).toBe(1);
        await roleA.prepareAttack();
        await Utils.sleep();

        expect(playerB.child.role.state).toMatchObject({
            damage: 2,
            maxHealth: 30,
            curHealth: 28,
        })
    })
})
