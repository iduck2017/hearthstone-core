import { MageHeroModel } from "@/common/hero/mage/hero";
import { PlayerModel } from "@/common/player";
import { RootModel } from "@/common/root";
import { LegacyExtensionModel } from "@/extension/legacy";
import { WispCardModel } from "@/extension/legacy/wisp/card";
import { AppService } from "@/service/app"
import { boot } from "./utils";

describe('card', () => {

    beforeAll(boot);

    test('get-card', () => {
        const root = AppService.root;
        if (!root) return;

        root.start({
            playerA: new PlayerModel({ child: { hero: new MageHeroModel({}) }}),
            playerB: new PlayerModel({ child: { hero: new MageHeroModel({}) }}),
        })
        const game = root.child.game;
        expect(game).toBeDefined();
        if (!game) return;

        const player = game.child.playerA;
        const hand = player.child.hand;
        expect(hand.child.cards.length).toBe(0);
        const card = new WispCardModel({});
        hand.add(card);
        expect(hand.child.cards.length).toBe(1);
    })

    test('use-card', () => {
        const root = AppService.root;
        const game = root?.child.game;
        if (!game) return;

        const player = game.child.playerA;
        const hand = player.child.hand;
        const board = player.child.board;
        const card = hand.child.cards[0];
        expect(card).toBeDefined();

        if (!card) return;
        expect(board.child.cards.length).toBe(0);
        expect(hand.child.cards.length).toBe(1);
        card.use();
        expect(board.child.cards.length).toBe(1);
        expect(hand.child.cards.length).toBe(0);
    })

})