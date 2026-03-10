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
    @useDep()
    private _origin: number;
    public get origin() {
        return this._origin;
    }

    @useState()
    @useDep(1)
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
    }
}           