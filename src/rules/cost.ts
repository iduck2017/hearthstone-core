import { useDep, useRoute, useState, Model, useMemo, useModel } from "set-piece";
import { CardModel } from "../cards";
import { PlayerModel } from "../entities/player";

export interface CostBuff {
    readonly name: string;
    readonly value: number;
    readonly id: string;
}

@useModel('cost-model')
export class CostModel extends Model {
    protected _brand: symbol = Symbol('cost-model');
    constructor(props?: {
        origin?: number;
        decors?: CostBuff[];
    }) {
        super();
        this._origin = props?.origin ?? 1;
        this._decors = props?.decors ?? [];
    }

    @useRoute(() => CardModel)
    private _card?: CardModel;

    @useState()
    private _origin: number;

    @useMemo()
    public get origin() {
        return this._origin;
    }

    @useState()
    private _decors: CostBuff[] = [];

    @useMemo()
    public get current() {
        let result = this._origin;
        this._decors.forEach(buff => {
            result += buff.value;
        });
        return result;
    }


    @useRoute(() => PlayerModel) 
    private _player?: PlayerModel;

    @useMemo()
    public consume() {
        if (!this._player) return;
        this._player.mana.consume(this.current);
    }
}           