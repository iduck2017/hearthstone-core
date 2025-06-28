import { BoardModel } from "@/common/container/board";
import { HandModel } from "@/common/container/hand";
import { GameModel } from "@/common/game";
import { MageHeroModel } from "@/common/hero/mage/hero";
import { PlayerModel } from "@/common/player";
import { ShatteredSunClericCardModel } from "@/extension/legacy/shattered-sun-cleric/card";
import { WispCardModel } from "@/extension/legacy/wisp/card";
import { AppService } from "@/service/app";
import { Selector } from "@/utils/selector";
import { RoleModel } from "@/common/role";
import { Utils } from "@/utils/utils";
import '@/index'

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
    });

    test('battlecry', async () => {
        const root = AppService.root;
        const game = root?.child.game;
        expect(game).toBeDefined();
        if (!game) return;
        const hand = game.child.playerA.child.hand;
        const board = game.child.playerA.child.board;
        const cardA = hand.child.cards.find(item => item instanceof ShatteredSunClericCardModel);
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
            refHealth: 1,
            damage: 0,
            maxHealth: 1,
            curHealth: 1,
            curAttack: 1,
        }
        const role = cardB.child.role;
        expect(role.state).toMatchObject(state);
        
        // Use Shattered Sun Cleric to buff the wisp
        process.nextTick(() => {
            const selector = Selector.current;
            expect(selector).toBeDefined();
            if (!selector) return;
            expect(selector.candidates.length).toBe(1);
            expect(selector.candidates).toContain(role);
            selector.set(role);
        })
        await cardA.preparePlay();
        
        // State after buff: +1/+1 (attack and health)
        expect(role.state).toMatchObject({
            ...state,
            modAttack: 1,      // +1 attack
            modHealth: 1,      // +1 health
            refHealth: 2,      // reference health increased
            curHealth: 2,      // current health increased
            maxHealth: 2,      // max health increased
            curAttack: 2,      // current attack increased
        });
    })

    test('skip', async () => {
        const root = AppService.root;
        const game = root?.child.game;
        expect(game).toBeDefined();
        if (!game) return;
        const hand = game.child.playerB.child.hand;
        const board = game.child.playerB.child.board;
        const cardA = hand.child.cards.find(item => item instanceof ShatteredSunClericCardModel);
        const cardB = hand.child.cards.find(item => item instanceof WispCardModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        if (!cardA || !cardB) return;
        
        // Player B has no minions on board, so battlecry cannot trigger
        const role = cardB.child.role;
        const state = {
            attack: 1,
            health: 1,
            modAttack: 0,
            modHealth: 0,
            refHealth: 1,
            maxHealth: 1,
            curHealth: 1,
            curAttack: 1,
            damage: 0,
        }
        expect(role.state).toMatchObject(state);
        expect(board.child.cards.length).toBe(0);
        
        // Play both cards, but no battlecry effect
        process.nextTick(() => {
            const selector = Selector.current;
            expect(selector).toBeUndefined();
        })
        await cardA.preparePlay();
        await Utils.sleep()
        await cardB.preparePlay();
        expect(role.state).toMatchObject(state);
    })

    test('attack', async () => {
        const root = AppService.root;
        const game = root?.child.game;
        expect(game).toBeDefined();
        if (!game) return;
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const cardA = boardA.child.cards.find(item => item instanceof WispCardModel);
        const cardB = boardB.child.cards.find(item => item instanceof WispCardModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        if (!cardA || !cardB) return;
        
        const roleA = cardA.child.role;
        const roleB = cardB.child.role;
        
        // Attack each other
        roleA.attack(roleB);
        
        // State after attack
        expect(roleA.state).toMatchObject({
            attack: 1,
            health: 1,
            modAttack: 1,      // +1 attack from cleric
            modHealth: 1,      // +1 health from cleric
            refHealth: 2,      // reference health
            maxHealth: 2,      // max health
            curHealth: 1,      // current health after taking 1 damage
            damage: 1,         // damage taken
        })
        expect(roleB.state).toMatchObject({
            attack: 1,
            health: 1,
            modAttack: 0,      // no buffs
            modHealth: 0,      // no buffs
            refHealth: 1,      // reference health
            maxHealth: 1,      // max health
            curHealth: -1,      // current health after taking 2 damage
            damage: 2,         // damage taken
        })
    })
})


