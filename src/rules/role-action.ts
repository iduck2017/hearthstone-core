import { useDep, useRoute, useState, CustomDecor, Model, useMemo, useRange, useDecorConsumer, useDecorProducer } from "set-piece";
import { RoleModel } from "../entities/role";
import { AsleepDecor } from "../decors/asleep";

export interface RoleActionBuff {
    value: number;
    id: string;
}

export class RoleActionModel extends Model {

    /** Routes */
    @useRoute(() => RoleModel)
    private _role?: RoleModel;
    @useMemo()
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
    @useMemo()
    public get current() {
        return this._current;
    }

    public consumeCurrent() {
        this._current -= 1;
    }

    public resetCurrent() {
        this._current = this.origin;
    }

    @useMemo()
    public get isEnable() {
        if (this.current <= 0) return false;
        if (this.isAsleep) return false;
        return true;
    }

    /** Sleep */
    @useDecorProducer(() => AsleepDecor)
    @useState()
    private _isAsleep: boolean;
    @useMemo()
    public get isAsleep() {
        return this._isAsleep;
    }

    public sleep() {
        this._isAsleep = true;
    }

    public wakeup() {
        this._isAsleep = false;
    }
    
    constructor() {
        super();
        this._current = this.origin;
        this._isAsleep = true;
        this.init();
    }
}
