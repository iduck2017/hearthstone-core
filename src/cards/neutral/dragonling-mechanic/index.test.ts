import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { DragonlingMechanicModel } from "./index";
import { MechanicalDragonlingModel } from "../../derivatives/mechanical-dragonling";
import { sleep } from "../../../utils/sleep";
import { MageModel } from "../../../heroes/mage";
import { ManaModel } from "../../../rules/mana";

describe('dragonling-mechanic', () => {
    const app = new AppModel();
    const dragonlingMechanic = new DragonlingMechanicModel();
    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            hand: new HandModel({
                cards: [dragonlingMechanic],
            }),
            board: new BoardModel(),
            mana: new ManaModel({
                maximum: 3,
            }),
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
        }),
    });
    
    const playerA = game.playerA;

    if (!dragonlingMechanic) throw new Error('Dragonling Mechanic not found');
    
    app.setGame(game);
    game.start();

    it('check-initial-state', () => {
        expect(playerA.board.cards.length).toBe(0);
        expect(game.currentPlayer).toBe(playerA);
        expect(playerA.mana.current).toBe(4);
        expect(dragonlingMechanic.deployer.isPlayable).toBe(true);
    })

    it('play-dragonling-mechanic', async () => {
        dragonlingMechanic.deployer.launch();
        await sleep();
        playerA.controller.selectTarget(0);
        await sleep();
        
        expect(playerA.hand.cards.length).toBe(0);
        expect(playerA.board.cards.length).toBe(2);
        expect(playerA.board.minions).toContain(dragonlingMechanic);
        
        const index = playerA.board.cards.indexOf(dragonlingMechanic);
        expect(index).toBe(0);
        const dragonling = playerA.board.cards[1];
        expect(dragonling).toBeInstanceOf(MechanicalDragonlingModel);
    })
})
