import { asRoute, asState, Model, useRange } from "set-piece";
import { PlayerModel } from "../entities/player";

export class ManaModel extends Model {

    @asRoute(() => PlayerModel)
    private _player?: PlayerModel;


    @asState()
    @useRange(0, undefined)
    private _maximum: number;
    public get maximum() {
        return this._maximum;
    }
    public addMaximum(value: number) {
        this._maximum += value;
        if (this._current > this._maximum) {
            this._current = this._maximum;
        }
    }

    @asState()
    @useRange(0, undefined)
    private _current: number;
    public get current() {
        return this._current;
    }
    public restoreCurrent(value: number) {
        this._current += value;
        if (this._current > this._maximum) {
            this._current = this._maximum;
        }
    } 

    constructor(props?: {
        maximum?: number;
        current?: number;
    }) {
        super();
        this._maximum = props?.maximum ?? 0;
        this._current = props?.current ?? 0;
    }


    public consume(value: number) {
        if (value > this._current) {
            console.error('Not enough mana');
            return;
        }
        this._current -= value;
    }
    
    public reset() {
        console.log('Reset current', this._maximum);
        this._current = this._maximum;
    }
}