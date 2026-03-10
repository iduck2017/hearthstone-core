import { asChild, asChildList, asState, Event, Model, usePostEmitter } from "set-piece";
import { PlayerModel } from "./player";
import { MageModel } from "../heroes/mage";
import { TurnEndEvent } from "../utils/turn-event";


export class GameModel extends Model {

    constructor(props?: {
        playerA?: PlayerModel;
        playerB?: PlayerModel;
    }) {
        super();
        this._playerA = props?.playerA ?? new PlayerModel({
            hero: new MageModel(),
        });
        this._playerB = props?.playerB ?? new PlayerModel({
            hero: new MageModel(),
        });
    }

    @asChild()
    private _playerA: PlayerModel;
    public get playerA() {
        return this._playerA;
    }

    @asChild()
    private _playerB: PlayerModel;
    public get playerB() {
        return this._playerB;
    }

    public get currentPlayer() {
        if (this._turn % 2) {
            return this._playerA;
        }
        return this._playerB;
    }
    

    @asState()
    private _isStarted: boolean = false;
    public get isStarted() {
        return this._isStarted;
    }

    @asState()
    private _turn: number = 0;
    public get turn() {
        return this._turn;
    }
    public nextTurn() {
        this.endTurn();
        this._turn += 1;
        this.startTurn();
    }

    @usePostEmitter(() => TurnEndEvent)
    private endTurn(): void {
        return;
    }
    
    private startTurn() {
        const currentPlayer = this.currentPlayer;
        currentPlayer.mana.addMaximum(1);
        currentPlayer.mana.reset();
        const minions = currentPlayer.board.minions;
        minions.forEach(minion => {
            minion.role.action.wakeup();
            minion.role.action.resetCurrent();
        });
    }

    public start() {
        if (this._isStarted) {
            console.error('Game already started');
            return;
        }
        this._isStarted = true;
        this._playerA.gainInitialCards(true);
        this._playerB.gainInitialCards(false);
        this.nextTurn();
    }

}