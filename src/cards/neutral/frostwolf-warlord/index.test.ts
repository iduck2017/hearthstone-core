import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { ManaModel } from "../../../rules/mana";
import { FrostwolfWarlordModel } from "./index";
import { WispModel } from "../wisp";
import { sleep } from "../../../utils/sleep";

describe("frostwolf-warlord", () => {
    const app = new AppModel();
    const frostwolfWarlord = new FrostwolfWarlordModel();
    const wispA = new WispModel();
    const wispB = new WispModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [wispA, wispB] }),
            hand: new HandModel({ cards: [frostwolfWarlord] }),
            mana: new ManaModel({ maximum: 10, current: 10 }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel(),
        }),
    });
    const playerA = game.playerA;
    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    it("check-initial-state", () => {
        expect(playerA.board.cards).toContain(wispA);
        expect(playerA.board.cards).toContain(wispB);
        expect(playerA.hand.cards).toContain(frostwolfWarlord);
    });

    it("battlecry-buffs-per-friendly-minion", async () => {
        // Play Frostwolf Warlord with 2 other friendly minions → +2/+2
        frostwolfWarlord.launcher.run();
        await sleep();
        playerA.controller.selectTarget(0); // select board position
        await sleep();

        expect(frostwolfWarlord.role.attack.current).toBe(6);
        expect(frostwolfWarlord.role.health.current).toBe(6);
    });
});
