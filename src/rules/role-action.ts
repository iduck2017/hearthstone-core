import { useChildList, useDep, useRoute, useState, CustomDecor, Model, useModifier, useDecor, useMemo, useRange } from "set-piece";
import { BooleanDecorModel, BooleanDecorType } from "../utils/boolean-decor";
import { AbstractConstructor } from "set-piece/dist/types";
import { RoleModel } from "../entities/role";
import { SleepDecor } from "../utils/sleep-decor";

export interface RoleActionBuff {
    value: number;
    id: string;
}

export class RoleActionModel extends Model {

    /** Routes */
    @useRoute(() => RoleModel)
    private _role?: RoleModel;       
    public get role() {
        return this._role;
    }

    /** Origin */
    @useState()
    @useDep()
    private _origin: RoleActionBuff[] = [];

    @useMemo()
    public get origin() {
        let result = 1;
        this._origin.forEach(buff => {
            result += buff.value;
        });
        return result;
    }


    /** Current */
    @useState()
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
    @useState()
    @useDecor(() => SleepDecor)
    private _isSleep: boolean;
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
        this._isSleep = true;
    }
}
