import { AppService } from "@/service/app"
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
        ]).toMatchObject([1, 0, 0, 1]);
        const card = handA.child.cards[0];
        await card?.preparePlay();
        expect([
            handA.child.cards.length,
            handB.child.cards.length,
            boardA.child.cards.length,
            boardB.child.cards.length,
        ]).toMatchObject([0, 0, 1, 1]);
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
        expect(roleA.state).toMatchObject(state);
        expect(roleB.state).toMatchObject(state);
        roleA.attack(roleB);
        state = {
            ...state,
            damage: 1,
            curHealth: 0,
            maxHealth: 1,
        }
        expect(roleA.state).toMatchObject(state);
        expect(roleB.state).toMatchObject(state);
    })

    test('prepare-attack', async () => {
        // Minions gain action points at the start of their turn
        // Without action points, minions cannot attack
        const root = AppService.root;
        const game = new GameModel({
            child: {
                playerA: new PlayerModel({
                    child: {
                        hero: new MageHeroModel({}),
                        board: new BoardModel({
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
        root?.start(game);
        expect(game).toBeDefined();
        
        const playerA = game.child.playerA;
        const playerB = game.child.playerB;
        const boardA = playerA.child.board;
        const boardB = playerB.child.board;
        const cardA = boardA.child.cards[0];
        const cardB = boardB.child.cards[0];
        if (!cardA || !cardB) return;
        const roleA = cardA.child.role;
        const roleB = cardB.child.role;
        
        // Initial state: both minions have 0 action points
        expect(roleA.state.action).toBe(0);
        expect(roleB.state.action).toBe(0);
        
        // Player A's turn starts: minion gains 1 action point
        game.nextTurn();
        expect(roleA.state.action).toBe(1);
        expect(roleB.state.action).toBe(0);

        // No selector should be available when minion has no action points
        process.nextTick(() => {
            const selector = Selector.current;
            expect(selector).toBeUndefined();
        })
        await roleB.prepareAttack();
        await Utils.sleep();

        // Selector should be available when minion has action points
        process.nextTick(() => {
            const selector = Selector.current;
            expect(selector).toBeDefined();
            if (!selector) return;
            expect(selector.candidates.length).toBe(2);
            expect(selector.candidates).toContain(roleB);
            expect(selector.candidates).toContain(playerB.child.role);
            selector.set(roleB);
        })
        await roleA.prepareAttack();
        await Utils.sleep();
        
        // After attack: action points are consumed and minions are damaged
        expect(roleA.state).toMatchObject({
            action: 0,
            curHealth: 0,
            damage: 1,
        });
        expect(roleB.state).toMatchObject({
            action: 0,
            curHealth: 0,
            damage: 1,
        });

        // No selector should be available after action points are consumed
        process.nextTick(() => {
            const selector = Selector.current;
            expect(selector).toBeUndefined();
        })
        await roleA.prepareAttack();
        await Utils.sleep();
    })
})