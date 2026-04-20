import { useDep, useRoute, useState, Model, useMemo } from "set-piece";
import { CardModel } from "../cards";

export interface CostBuff {
    readonly name: string;
    readonly value: number;
    readonly id: string;
}

export class CostModel extends Model {
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

    constructor(props?: {
        origin?: number;
        decors?: CostBuff[];
    }) {
        super();
        this._origin = props?.origin ?? 1;
        this._decors = props?.decors ?? [];
        this.init();
    }
}           