import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { HandModel } from "../../../entities/hand";
import { MageModel } from "../../../heroes/mage";
import { sleep } from "../../../utils/sleep";
import { ManaModel } from "../../../rules/mana";
import { XaviusModel } from "./index";
import { WispModel } from "../wisp";
import { SatyrModel } from "../../derivatives/satyr";

describe('xavius', () => {
    const app = new AppModel();
    const xavius = new XaviusModel();
    const wisp1 = new WispModel();
    const wisp2 = new WispModel();

    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            hand: new HandModel({
                cards: [xavius, wisp1, wisp2],
            }),
            mana: new ManaModel({ maximum: 10, current: 10 }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
        }),
    });

    const playerA = game.playerA;

    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    it('check-initial-state', () => {
        expect(playerA.hand.cards).toContain(xavius);
        expect(playerA.board.minions.length).toBe(0);
    });

    it('play-xavius-does-not-spawn-satyr', async () => {
        xavius.deployer.launch();
        await sleep();
        playerA.controller.selectTarget(0);
        await sleep();
        // feat is inactive during own deployment, no satyr should appear
        expect(playerA.board.minions.length).toBe(1);
        expect(playerA.board.minions[0]).toBe(xavius);
        expect(xavius.role.attack.current).toBe(7);
        expect(xavius.role.health.current).toBe(5);
    });

    it('play-card-spawns-satyr-next-to-xavius', async () => {
        // board: [xavius], play wisp1 at position 1
        wisp1.deployer.launch();
        await sleep();
        playerA.controller.selectTarget(1);
        await sleep();
        // board should be [xavius, satyr, wisp1]
        expect(playerA.board.minions.length).toBe(3);
        expect(playerA.board.minions[0]).toBe(xavius);
        const satyr = playerA.board.minions[1];
        expect(satyr instanceof SatyrModel).toBe(true);
        expect(playerA.board.minions[2]).toBe(wisp1);
    });

    it('play-another-card-spawns-another-satyr', async () => {
        // board: [xavius, satyr, wisp1], play wisp2 at position 3
        wisp2.deployer.launch();
        await sleep();
        playerA.controller.selectTarget(3);
        await sleep();
        // board should be [xavius, satyr2, satyr, wisp1, wisp2]
        expect(playerA.board.minions.length).toBe(5);
        expect(playerA.board.minions[0]).toBe(xavius);
        const satyr = playerA.board.minions[1];
        expect(satyr instanceof SatyrModel).toBe(true);
    });
});
