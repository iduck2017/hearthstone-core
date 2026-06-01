import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { ManaModel } from "../../../rules/mana";
import { sleep } from "../../../utils/sleep";
import { MurlocTidecallerModel } from "./index";
import { MurlocRaiderModel } from "../murloc-raider";
import { MurlocTidehunterModel } from "../murloc-tidehunter";
import { WispModel } from "../wisp";

describe("murloc-tidecaller", () => {
    const app = new AppModel();
    const murlocTidecaller = new MurlocTidecallerModel();
    const murlocRaider = new MurlocRaiderModel();
    const murlocTidehunter = new MurlocTidehunterModel();
    const wisp = new WispModel();

    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [] }),
            hand: new HandModel({ cards: [murlocTidecaller, murlocRaider, murlocTidehunter, wisp] }),
            mana: new ManaModel({ current: 10, maximum: 10 }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({ cards: [] }),
            hand: new HandModel({ cards: [] }),
            mana: new ManaModel({ current: 10, maximum: 10 }),
        }),
    });

    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    const playerA = game.playerA;

    it("no-self-trigger", async () => {
        murlocTidecaller.deployer.launch();
        await sleep();
        playerA.controller.selectTarget(0);

        expect(murlocTidecaller.role.attack.current).toBe(1);
    });

    it("triggers-on-murloc-played", async () => {
        murlocRaider.deployer.launch();
        playerA.controller.selectTarget(1);
        await sleep();
        expect(murlocTidecaller.role.attack.current).toBe(2);
    });

    it("triggers-on-token-summon", async () => {
        murlocTidehunter.deployer.launch();
        await sleep();
        playerA.controller.selectTarget(2);
        await sleep();
        expect(murlocTidecaller.role.attack.current).toBe(4);
    });

    it("no-trigger-on-non-murloc", async () => {
        wisp.deployer.launch();
        await sleep();
        playerA.controller.selectTarget(3);

        expect(murlocTidecaller.role.attack.current).toBe(4);
    });
});
