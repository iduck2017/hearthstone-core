import { useChild, useState, Event, Model, TypedPropertyDecorator, useRoute, useEventConsumer, PostEvent, PrevEvent, useEventProducer, useMemo, useModel } from "set-piece";
import { PlayerModel } from "./player";
import { MageModel } from "../heroes/mage";
import { TurnEndPostEvent, TurnEndPrevEvent } from "../event/turn-end";

@useModel('game-model')
export class GameModel extends Model {
    protected _brand: symbol = Symbol('game-model');

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
    @useMemo()
    public get playerA() {
        return this._playerA;
    }

    @useChild()
    private _playerB: PlayerModel;
    @useMemo()
    public get playerB() {
        return this._playerB;
    }

    @useMemo()
    public get currentPlayer() {
        if (this._turn % 2) {
            return this._playerA;
        }
        return this._playerB;
    }


    @useState()
    private _isStarted: boolean = false;
    @useMemo()
    public get isStarted() {
        return this._isStarted;
    }

    @useState()
    private _turn: number = 0;
    @useMemo()
    public get turn() {
        return this._turn;
    }
    public nextTurn() {
        this.endTurn({});
        this._turn += 1;
        this.startTurn();
    }

    @useEventProducer(() => [TurnEndPrevEvent, TurnEndPostEvent])
    private endTurn(options: {}, event?: TurnEndPrevEvent): void {
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

    public start(options?: {
        isInitPhaseIgnored?: boolean;  
    }) {
        if (this._isStarted) {
            console.error('Game already started');
            return;
        }
        this._isStarted = true;
        if (!options?.isInitPhaseIgnored) {
            this._playerA.handleGameInit(true);
            this._playerB.handleGameInit(false);
        }
        this.nextTurn();
    }

}
