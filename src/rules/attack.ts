import { asChildList, asDependency, asState, Model, useEffect, useMemory, useRange } from "set-piece";
import { MinionModel } from "../entities/minion";

export type AttackBuff = {
    name: string;
    value: number;
}

export class AttackModel extends Model {

    @useRange(0, undefined)
    @asState()
    @asDependency()
    private _origin: number;
    public get origin() {
        return this._origin;
    }

    @asState()
    @asDependency(true)
    private _buffs: AttackBuff[];

    @useMemory()
    @useRange(0, undefined)
    public get current() {
        let result = this._origin;
        this._buffs?.forEach(buff => {
            result += buff.value;
        });
        return result;
    }

    constructor(props?: {
        origin?: number;
        buffs?: AttackBuff[];
    }) {
        super();
        this._origin = props?.origin ?? 1;
        this._buffs = props?.buffs ?? [];
    }

}