import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { RazorfenHunterModel } from "./index";
import { BoarModel } from "../../derivatives/boar";
import { sleep } from "../../../utils/sleep";
import { MageModel } from "../../../heroes/mage";
import { ManaModel } from "../../../rules/mana";

describe('razorfen-hunter', () => {
    const app = new AppModel();
    const razorfenHunter = new RazorfenHunterModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            hand: new HandModel({
                cards: [razorfenHunter],
            }),
            board: new BoardModel(),
            mana: new ManaModel({
                maximum: 2,
            }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
        }),
    });
    
    const playerA = game.playerA;

    if (!razorfenHunter) throw new Error('Razorfen Hunter not found');
    
    app.setGame(game);
    game.start();

    it('check-initial-state', () => {
        expect(playerA.board.cards.length).toBe(0);
        expect(game.currentPlayer).toBe(playerA);
        expect(playerA.mana.current).toBe(3);
        expect(razorfenHunter.isPlayable).toBe(true);
    })

    it('play-razorfen-hunter', async () => {
        razorfenHunter.play();
        await sleep();
        playerA.controller.selectTarget(0);
        await sleep();
        
        expect(playerA.hand.cards.length).toBe(0);
        expect(playerA.board.cards.length).toBe(2);
        expect(playerA.board.minions).toContain(razorfenHunter);
        
        const index = playerA.board.cards.indexOf(razorfenHunter);
        expect(index).toBe(0);
        const boar = playerA.board.cards[1];
        expect(boar).toBeInstanceOf(BoarModel);
    })
})
