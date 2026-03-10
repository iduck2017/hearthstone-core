import { useChildList, useDep, useRoute, useState, Model, useEffect, useMemo, useRange } from "set-piece";
import { NumberDecorModel, NumberDecorType } from "../utils/number-decor";

export class RoleHealthModel extends Model {
    // Origin
    @useState()
    @useDep()
    @useRange(0, undefined)
    private _origin: number;
    public get origin() {
        return this._origin;
    }

    // Current
    @useState()
    private _current: number;
    public get current() {
        return this._current;
    }

    public setCurrent(value: number) {
        this._current = this.maximum;
    }

    public consumeCurrent(value: number) {
        this._current -= value;
    }

    public restoreCurrent(value: number) {
        this._current += value;
        if (this._current > this.maximum) {
            this._current = this.maximum;
        }
    }
    
    // Maximum
    @useChildList()
    @useDep(1)
    private _maximum: NumberDecorModel[];

    @useMemo()
    public get maximum() {
        let result = this._origin;
        this._maximum?.forEach(decor => {
            result += decor.value;
        });
        return result;
    }
    
    public addDecor(decor: NumberDecorModel) {
        this._maximum.push(decor);
        if (decor.type === NumberDecorType.OVERRIDE) {
            this._current = this.maximum
        }
        if (decor.type === NumberDecorType.BUFF) {
            this._current += decor.value;
        }
        console.log(this.current, this.maximum)
    }

    public removeDecor(decor: NumberDecorModel) {
        console.log("Remove decor")
        const index = this._maximum.indexOf(decor);
        if (index !== -1) {
            this._maximum.splice(index, 1);
        }
        if (this._current > this.maximum) {
            this._current = this.maximum;
        }
    }

    constructor(props?: {
        origin?: number;
        decors?: NumberDecorModel[];
        current?: number;
    }) {
        super();
        this._origin = props?.origin ?? 1;
        this._maximum = props?.decors ?? [];
        this._current = props?.current ?? this.origin;
    }   
}
