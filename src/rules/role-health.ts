import { asDependency, asRoute, asState, Model, useEffect, useMemory, useRange } from "set-piece";
import { MinionModel } from "../entities/minion";

export interface RoleHealthDecor {
    readonly name: string;
    readonly value: number;
    readonly id?: string;
}

export class RoleHealthModel extends Model {

    @asRoute(() => MinionModel)
    private _minion?: MinionModel;

    @asState()
    @asDependency()
    @useRange(0, undefined)
    private _origin: number;
    public get origin() {
        return this._origin;
    }

    @asState()
    @asDependency(true)
    private _buffs: RoleHealthDecor[];

    @asState()
    private _current: number;
    public get current() {
        return this._current;
    }
    public consume(value: number) {
        this._current -= value;
    }

    public restore(value: number) {
        this._current += value;
        if (this._current > this.maximum) {
            this._current = this.maximum;
        }
    }


    @useMemory()
    public get maximum() {
        let result = this._origin;
        this._buffs?.forEach(buff => {
            result += buff.value;
        });
        return result;
    }

    
    constructor(props?: {
        origin?: number;
        buffs?: RoleHealthDecor[];
        current?: number;
    }) {
        super();
        this._origin = props?.origin ?? 1;
        this._buffs = props?.buffs ?? [];
        this._current = props?.current ?? this.origin;
    }   
}
