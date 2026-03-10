import { useChild, useChildList, useState, Event, Model, usePostEvent } from "set-piece";
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

    @useChild()
    private _playerA: PlayerModel;
    public get playerA() {
        return this._playerA;
    }

    @useChild()
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
    

    @useState()
    private _isStarted: boolean = false;
    public get isStarted() {
        return this._isStarted;
    }

    @useState()
    private _turn: number = 0;
    public get turn() {
        return this._turn;
    }
    public nextTurn() {
        this.endTurn();
        this._turn += 1;
        this.startTurn();
    }

    @usePostEvent(() => TurnEndEvent)
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
        this._playerA.prepareInitialCards(true);
        this._playerB.prepareInitialCards(false);
        this.nextTurn();
    }

}