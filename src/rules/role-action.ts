import { asDependency, asState, Model, useMemory, useRange } from "set-piece";

export interface RoleActionBuff {
    value: number;
    id: string;
}

export class RoleActionModel extends Model {
    @asState()
    @asDependency()
    private _buffs: RoleActionBuff[] = [];

    @useMemory()
    public get origin() {
        let result = 1;
        this._buffs.forEach(buff => {
            result += buff.value;
        });
        return result;
    }

    @asState()
    @useRange(0, undefined)
    private _current: number;
    public get current() {
        return this._current;
    }

    public consume() {
        this._current -= 1;
    }

    public reset() {
        this._current = this.origin;
    }

    constructor() {
        super();
        this._current = 0;
    }
}