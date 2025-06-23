import { ShatteredSunClericCardModel } from "@/extension/legacy/shattered-sun-cleric/card";
import { boot, resetBoard, startGame } from "../utils";
import { WispCardModel } from "@/extension/legacy/wisp/card";
import { AppService } from "@/service/app";
import { Selector } from "@/utils/selector";

describe('shattered-sun-cleric', () => {
    beforeAll(boot);
    beforeAll(startGame);

    test('buff', () => {
        const { boardA, boardB } = resetBoard(
            [new WispCardModel({})],
            [new WispCardModel({})]
        );
        const wispA = boardA.child.cards[0]?.child.role;
        const wispB = boardB.child.cards[0]?.child.role;
        if (!wispA || !wispB) return;
        expect(wispA.state.attack).toBe(1);
        expect(wispA.state.health).toBe(1);

        const card = new ShatteredSunClericCardModel({});
        const game = AppService.root?.child.game;
        if (!game) return;

        const handA = game.child.playerA.child.hand;
        handA.add(card);
    });
})