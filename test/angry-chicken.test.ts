import { BoardModel } from "@/common/container/board";
import { GameModel } from "@/common/game";
import { MageHeroModel } from "@/common/hero/mage/hero";
import { PlayerModel } from "@/common/player";
import { AngryBirdCardModel } from "@/extension/legacy/angry-bird/card";
import { AppService } from "@/service/app";
import { RoleModel } from "@/common/role";
import '@/index'

describe('angry-chicken', () => {
    test('start', async () => {
        const root = AppService.root;
        expect(root).toBeDefined();
        if (!root) return
        
        // Initialize game with two Angry Birds on the board
        const game = new GameModel({
            child: {
                playerA: new PlayerModel({
                    child: {
                        hero: new MageHeroModel({}),
                        board: new BoardModel({
                            child: { cards: [new AngryBirdCardModel({})] }
                        })
                    }
                }),
                playerB: new PlayerModel({
                    child: {
                        hero: new MageHeroModel({}),
                        board: new BoardModel({
                            child: { cards: [new AngryBirdCardModel({})] }
                        })
                    }
                })
            }
        })
        root.start(game)
    });

    test('attack', async () => {
        const root = AppService.root;
        const game = root?.child.game;
        expect(game).toBeDefined();
        if (!game) return;
        
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const cardA = boardA.child.cards.find(item => item instanceof AngryBirdCardModel);
        const cardB = boardB.child.cards.find(item => item instanceof AngryBirdCardModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        if (!cardA || !cardB) return;
        
        const roleA = cardA.child.role;
        const roleB = cardB.child.role;
        
        // Initial state: both Angry Birds are at full health (1/1)
        // When at full health, they don't have the +5 attack buff
        let state: RoleModel['state'] = {
            attack: 1,
            health: 1,
            modAttack: 0,      // No attack buff when at full health
            modHealth: 0,
            refHealth: 1,
            maxHealth: 1,
            curHealth: 1,      // Full health
            curAttack: 1,      // Base attack only
            damage: 0,
        }
        
        expect(roleA.state).toEqual(state);
        expect(roleB.state).toEqual(state);
        
        // First attack: both birds attack each other
        // They will deal 1 damage to each other (base attack)
        roleA.attack(roleB);
        
        // After first attack: both birds are damaged (0/1)
        // When damaged, they get +5 attack buff
        state = {
            attack: 1,
            health: 1,
            modAttack: 5,      // +5 attack buff when damaged
            modHealth: 0,
            refHealth: 1,
            maxHealth: 1,
            curHealth: 0,      // Damaged (0/1)
            curAttack: 6,      // Base attack (1) + buff (5) = 6
            damage: 1,         // Damage taken
        }
        expect(roleA.state).toEqual(state);
        expect(roleB.state).toEqual(state);
    })
})
