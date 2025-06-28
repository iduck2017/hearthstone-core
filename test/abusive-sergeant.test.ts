import { BoardModel } from "@/common/container/board";
import { HandModel } from "@/common/container/hand";
import { GameModel } from "@/common/game";
import { MageHeroModel } from "@/common/hero/mage/hero";
import { PlayerModel } from "@/common/player";
import { AbusiveSergeantCardModel } from "@/extension/legacy/abusive-sergeant/card";
import { WispCardModel } from "@/extension/legacy/wisp/card";
import { AppService } from "@/service/app";
import { Selector } from "@/utils/selector";
import { RoleModel } from "@/common/role";
import '@/index'

describe('abusive-sergeant', () => {
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
                                new AbusiveSergeantCardModel({}),
                                new WispCardModel({})
                            ]}
                        })
                    }
                }),
                playerB: new PlayerModel({
                    child: {
                        hero: new MageHeroModel({}),
                        hand: new HandModel({
                            child: { cards: [
                                new AbusiveSergeantCardModel({}),
                                new WispCardModel({})
                            ]}
                        })
                    }
                })
            }
        })
        root.start(game)
    });

    test('skip', async () => {
        const root = AppService.root;
        const game = root?.child.game;
        expect(game).toBeDefined();
        if (!game) return;
        const hand = game.child.playerB.child.hand;
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const cardA = hand.child.cards.find(item => item instanceof AbusiveSergeantCardModel);
        const cardB = hand.child.cards.find(item => item instanceof WispCardModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        if (!cardA || !cardB) return;
        
        // Player B has no minions on board, so Abusive Sergeant cannot trigger battlecry
        expect(boardB.child.cards.length).toBe(0);
        expect(boardA.child.cards.length).toBe(0);
        
        // Play both cards without battlecry effect
        await cardA.preparePlay();
        await cardB.preparePlay();
        expect(boardB.child.cards.length).toBe(2);
        
        // Wisp state remains normal, no buff applied
        const role = cardB.child.role;
        const state: RoleModel['state'] = {
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
        expect(role.state).toEqual(state);
    })

    test('battlecry', async () => {
        const root = AppService.root;
        const game = root?.child.game;
        expect(game).toBeDefined();
        if (!game) return;
        const hand = game.child.playerA.child.hand;
        const cardA = hand.child.cards.find(item => item instanceof AbusiveSergeantCardModel);
        const cardB = hand.child.cards.find(item => item instanceof WispCardModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        if (!cardA || !cardB) return;
        
        // Initial state of the wisp
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
        const role = cardB.child.role;
        expect(role.state).toEqual(state);
        
        // Play the wisp first to have a target on board
        await cardB.preparePlay();
        
        // Use Abusive Sergeant to buff the wisp with +2 attack
        process.nextTick(() => {
            Selector.current?.set(role)
        })
        await cardA.preparePlay();
        
        // State after buff: +2 attack only, health unchanged
        expect(role.state).toEqual({
            ...state,
            modAttack: 2,      // +2 attack
            curAttack: 3,      // current attack (1 + 2)
        });
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
        
        // State before attack: Player A's wisp has +2 attack buff
        const stateA: RoleModel['state'] = {
            attack: 1,
            health: 1,
            modAttack: 2,      // +2 attack from Abusive Sergeant
            modHealth: 0,      // no health buff
            refHealth: 1,      // reference health unchanged
            maxHealth: 1,      // max health unchanged
            curHealth: 1,      // current health
            curAttack: 3,      // current attack (1 + 2)
            damage: 0,
        }
        expect(roleA.state).toEqual(stateA);
        
        const stateB: RoleModel['state'] = {
            attack: 1,
            health: 1,
            modAttack: 0,      // no buffs
            modHealth: 0,      // no buffs
            refHealth: 1,      // reference health
            maxHealth: 1,      // max health
            curHealth: 1,      // current health
            curAttack: 1,      // current attack
            damage: 0,
        }
        expect(roleB.state).toEqual(stateB);
        
        // Attack each other
        roleA.attack(roleB);
        
        // State after attack: buffed wisp deals 3 damage, takes 1 damage
        expect(roleA.state).toEqual({
            ...stateA,
            damage: 1,         // damage taken
            curHealth: 0,      // current health after taking 1 damage
            curAttack: 3,      // buff still active
        });
        
        expect(roleB.state).toEqual({
            ...stateB,
            damage: 3,         // damage taken (1 + 2 from buffed attack)
            curHealth: -2,     // current health after taking 3 damage
            curAttack: 1,      // no buffs
        });
    })

    test('end-of-turn', async () => {
        const root = AppService.root;
        const game = root?.child.game;
        expect(game).toBeDefined();
        if (!game) return;
        const board = game.child.playerA.child.board;
        const card = board.child.cards.find(item => item instanceof WispCardModel);
        const role = card?.child.role;
        expect(role).toBeDefined();
        if (!role) return;

        const state: RoleModel['state'] = {
            attack: 1,
            health: 1,
            modAttack: 2,
            modHealth: 0,
            refHealth: 1,
            maxHealth: 1,
            curHealth: 0,
            curAttack: 3,
            damage: 1,
        }
        expect(role.state).toEqual(state);
        game.nextTurn();
        expect(role.state).toEqual({
            ...state,
            modAttack: 0,
            curAttack: 1,
        });
    })
})
