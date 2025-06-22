import { MageHeroModel } from "@/common/hero/mage/hero";
import { PlayerModel } from "@/common/player";
import { RootModel } from "@/common/root";
import { LegacyExtensionModel } from "@/extension/legacy";
import { WispCardModel } from "@/extension/legacy/wisp/card";
import { AppService } from "@/service/app";
import { boot } from "./utils";

describe('game', () => {

    beforeAll(boot);
    
    test('start', () => {
        const root = AppService.root;
        if (!root) return;
        root.start({
            playerA: new PlayerModel({ child: { hero: new MageHeroModel({}) }}),
            playerB: new PlayerModel({ child: { hero: new MageHeroModel({}) }}),
        })
        expect(root.child.game).toBeDefined();
        console.warn(root.child.game, 1);
    })

    test('next-turn', () => {
        const root = AppService.root;
        const game = root?.child.game;
        expect(game).toBeDefined();
        if (!game) return;
        expect(game.state.turn).toBe(0);
        game.nextTurn();
        expect(game.state.turn).toBe(1);
    })


})
