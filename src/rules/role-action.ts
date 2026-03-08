import { asChildList, asDependency, asState, Model, useMemory, useRange } from "set-piece";
import { BooleanDecorModel, BooleanDecorType } from "../utils/boolean-decor";

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
    @asChildList()
    private _isSleep: BooleanDecorModel[]
    public get isSleep() {
        let result = false;
        this._isSleep.forEach(decor => {
            result = decor.value;
        });
        return result;
    }

    public addSleepDecor(decor: BooleanDecorModel) {
        this._isSleep.push(decor);
    }

    public removeSleepDecor(decor: BooleanDecorModel) {
        const index = this._isSleep.indexOf(decor);
        if (index === -1) return;
        this._isSleep.splice(index, 1);
    }

    public resetSleep() {
        this._isSleep = this._isSleep.filter(item => (
            item.type !== BooleanDecorType.BUFF
        ));
    }

    constructor() {
        super();
        this._current = this.origin;
        this._isSleep = [];
    }
}