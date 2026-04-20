import { useRoute, useState, Model, useRange, useMemo } from "set-piece";
import { PlayerModel } from "../entities/player";

export class ManaModel extends Model {

    @useRoute(() => PlayerModel)
    private _player?: PlayerModel;


    @useState()
    @useRange(0, undefined)
    private _maximum: number;
    @useMemo()
    public get maximum() {
        return this._maximum;
    }

    public addMaximum(value: number) {
        this._maximum += value;
        if (this._current > this._maximum) {
            this._current = this._maximum;
        }
    }

    @useState()
    @useRange(0, undefined)
    private _current: number;
    @useMemo()
    public get current() {
        return this._current;
    }

    public restore(value: number) {
        this._current += value;
    } 

    constructor(props?: {
        maximum?: number;
        current?: number;
    }) {
        super();
        this._maximum = props?.maximum ?? 0;
        this._current = props?.current ?? 0;
        this.init();
    }

    public consume(value: number) {
        if (value > this._current) {
            console.error('Not enough mana');
            return;
        }
        this._current -= value;
    }
    
    public reset() {
        console.log('Reset mana', this._maximum);
        this._current = this._maximum;
    }
}