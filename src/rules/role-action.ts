import { asDependency, asState, Model, useMemory, useRange } from "set-piece";

export interface RoleActionBuff {
    value: number;
    id: string;
}

export class RoleActionModel extends Model {
    /** Origin */
    @asState()
    @asDependency()
    private _origin: RoleActionBuff[] = [];

    @useMemory()
    public get origin() {
        let result = 1;
        this._origin.forEach(buff => {
            result += buff.value;
        });
        return result;
    }


    /** Current */
    @asState()
    @useRange(0, undefined)
    private _current: number;
    public get current() {
        return this._current;
    }

    public consumeCurrent() {
        this._current -= 1;
    }

    public resetCurrent() {
        this._current = this.origin;
    }

    public get isEnable() {
        if (this.current <= 0) return false;
        if (this.isSleep) return false;
        return true;
    }

    /** Sleep */
    @asState()
    private _isSleep: boolean
    public get isSleep() {
        return this._isSleep;
    }

    public sleep() {
        this._isSleep = true;
    }

    public wakeup() {
        this._isSleep = false;
    }

    constructor() {
        super();
        this._current = this.origin;
        this._isSleep = false;
    }
}