import { asChildList, asDependency, asRoute, asState, Model, useEffect, useMemory, useRange } from "set-piece";
import { NumberDecorModel, NumberDecorType } from "../utils/decor";

export class RoleHealthModel extends Model {
    // Origin
    @asState()
    @asDependency()
    @useRange(0, undefined)
    private _origin: number;
    public get origin() {
        return this._origin;
    }

    // Current
    @asState()
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
    @asChildList()
    @asDependency(true)
    private _maximum: NumberDecorModel[];

    @useMemory()
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
            this.setCurrent(this.maximum);
        }
        if (decor.type === NumberDecorType.BUFF) {
            this.restoreCurrent(decor.value);
        }
    }

    public removeDecor(decor: NumberDecorModel) {
        const index = this._maximum.indexOf(decor);
        if (index !== -1) {
            this._maximum.splice(index, 1);
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
