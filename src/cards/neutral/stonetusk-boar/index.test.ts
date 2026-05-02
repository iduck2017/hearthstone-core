/**
 * Scenario:
 * - playerA hand: boar (1/1, charge, costs 1) + wisp (1/1, no charge, costs 0)
 * - playerB board: target (1/1)
 * - Turn 1: playerA has 1 mana
 *
 * Test 1 — check-initial-state:
 *   boar and wisp are in hand, not yet on board.
 *
 * Test 2 — play-wisp-no-charge:
 *   Play wisp (costs 0) onto the board; it has no charge so it cannot attack this turn.
 *
 * Test 3 — play-boar-with-charge:
 *   Play boar (costs 1 mana) onto the board; charge triggers wakeup()
 *   so it can attack immediately.
 *
 * Test 4 — boar-attacks-immediately:
 *   boar attacks target the same turn it was played; both die.
 */

import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { MageModel } from "../../../heroes/mage";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { DeckModel } from "../../../entities/deck";
import { WispModel } from "../wisp";
import { StonetuskBoarModel } from "./index";
import { sleep } from "../../../utils/sleep";

describe('stonetusk-boar', () => {
    const app = new AppModel();
    const boar = new StonetuskBoarModel();
    const wisp = new WispModel();
    const target = new WispModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            hand: new HandModel({
                cards: [boar, wisp],
            }),
            deck: new DeckModel(),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
            board: new BoardModel({
                cards: [target],
            }),
        }),
    });
    const playerA = game.playerA;
    app.setGame(game);
    game.start();

    it('check-initial-state', () => {
        expect(boar.role.charge.isActived).toBe(true);
        expect(wisp.role.charge.isActived).toBe(false);
        expect(playerA.hand.cards).toContain(boar);
        expect(playerA.hand.cards).toContain(wisp);
        expect(playerA.mana.current).toBe(1);
    })

    it('play-wisp-no-charge', async () => {
        wisp.deployer.launch();
        await sleep();
        playerA.controller.selectTarget(0);
        await sleep();
        expect(playerA.board.cards).toContain(wisp);
        expect(wisp.role.action.isAsleep).toBe(true);
        expect(wisp.role.action.isEnabled).toBe(undefined);
    })

    it('play-boar-with-charge', async () => {
        boar.deployer.launch();
        await sleep();
        playerA.controller.selectTarget(0);
        await sleep();
        expect(playerA.board.cards).toContain(boar);
        expect(boar.role.charge.isActived).toBe(true);
        expect(boar.role.action.isAsleep).toBe(false);
        expect(boar.role.action.isEnabled).toBe(true);
    })

    // it('boar-attacks-immediately', async () => {
    //     boar.role.action.launch();
    //     await sleep();
    //     playerA.controller.selectTarget(target.role);
    //     await sleep();
    //     expect(boar.role.health.current).toBe(0);
    //     expect(target.role.health.current).toBe(0);
    //     expect(boar.disposer.isActived).toBe(true);
    //     expect(target.disposer.isActived).toBe(true);

    //     expect(boar.role.action.current).toBe(0)
    //     expect(boar.role.action.isAsleep).toBe(false);
    //     expect(boar.role.action.isEnabled).toBe(undefined);
    // })
})
