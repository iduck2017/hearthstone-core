import { RootModel } from "@/common/root";
import { LegacyExtensionModel } from "@/extension/legacy";
import { AppService } from "@/service/app"
import { boot, resetBoard, startGame } from "./utils";
import { WispCardModel } from "@/extension/legacy/wisp/card";

describe('attack', () => {
    beforeAll(boot);
    beforeAll(startGame);

    test('attack', () => {
        const { boardA, boardB } = resetBoard(
            [new WispCardModel({})],
            [new WispCardModel({})]
        );
        const cardA = boardA.child.cards[0];
        const cardB = boardB.child.cards[0];
        if (!cardA || !cardB) return;

        const wispA = cardA.child.role;
        const wispB = cardB.child.role;
        expect(wispA.state.maxHealth).toBe(1);
        expect(wispA.state.attack).toBe(1);

        expect(wispA.state.curHealth).toBe(1);
        expect(wispB.state.curHealth).toBe(1);
        wispA.attack(wispB);
        expect(wispA.state.curHealth).toBe(0);
        expect(wispB.state.curHealth).toBe(0);
    })
})