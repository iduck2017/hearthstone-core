import { asDependency, asRoute, asState, Model, useMemory } from "set-piece";
import { CardModel } from "../entities/card";

export interface CostBuff {
    readonly name: string;
    readonly value: number;
    readonly id: string;
}

export class CostModel extends Model {
    @asRoute(() => CardModel)
    private _card?: CardModel;

    @asState()
    @asDependency()
    private _origin: number;
    public get origin() {
        return this._origin;
    }

    @asState()
    @asDependency(true)
    private _buffs: CostBuff[] = [];

    @useMemory()
    public get current() {
        let result = this._origin;
        this._buffs.forEach(buff => {
            result += buff.value;
        });
        return result;
    }

    constructor(props?: {
        origin?: number;
        buffs?: CostBuff[];
    }) {
        super();
        this._origin = props?.origin ?? 1;
        this._buffs = props?.buffs ?? [];
    }
}           