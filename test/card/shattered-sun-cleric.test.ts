import { ShatteredSunClericCardModel } from "@/extension/legacy/shattered-sun-cleric/card";
import { boot, resetBoard, startGame } from "../utils";
import { WispCardModel } from "@/extension/legacy/wisp/card";
import { AppService } from "@/service/app";
import { Selector } from "@/utils/selector";

describe('shattered-sun-cleric', () => {
    beforeAll(boot);
    beforeAll(startGame);

    test('buff', async () => {
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

        process.nextTick(() => {
            const selector = Selector.current;
            expect(selector).toBeDefined();
            selector?.set(wispA);
        })
        await card.prepare();
        expect(wispA.state.attack).toBe(2);
        expect(wispA.state.health).toBe(2);
    });
})


// original 5/5
// get buff 5+3/5+3 = 8/8
// recv 1 dmg 5+(3-1)/5+3 = 7/8
// recv 3 dmg (5-1)+(3-3)/5+3 = 4/8
// silence (5-1)+fix(0-3)/5 = 4/5
// autofix (5-1)/5 = 4/5

// original 5/5
// get debuff fix(5/5-3) = 2/2
// autofix 2/(5-3) = 2/2
// silence 2/5 = 2/5

// 5+(3-1)/5+3-3 = 7/5
// autofix (5-2)+(3-1)/5+3-3 = 5/5
// (5-2)+(0-1)/5-3 = 3/2
// autofix (5-3)/5-3 = 2/2

// (5-2)+(3-1)/5+3 = 5/8

// (5-3)+(10-1)/5+10 = 11/15
// (5-3)+(0-1)/5 = 2/5

// 5+(10-4)/5+10-10 = 11/5
// autofix 5+(10-10)/5+10-10 = 5/5
// 5+(10-10)/5+10 = 5/15
// 5+(0-10)/5 = 5/5
