import { asChildList, asDependency, asRoute, asState, Model, useEffect, useMemory, useRange } from "set-piece";
import { MinionModel } from "../entities/minion";
import { RoleHealthDecorModel, RoleHealthDecorType } from "./role-health-decor";

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
    @useMemory()
    public get maximum() {
        let result = this._origin;
        this._decors?.forEach(decor => {
            result += decor.value;
        });
        return result;
    }
    
    @asChildList()
    @asDependency(true)
    private _decors: RoleHealthDecorModel[];

    public addDecor(decor: RoleHealthDecorModel) {
        this._decors.push(decor);
        if (decor.type === RoleHealthDecorType.OVERRIDE) {
            this.setCurrent(this.maximum);
        }
        if (decor.type === RoleHealthDecorType.BUFF) {
            this.restoreCurrent(decor.value);
        }
    }

    public removeDecor(decor: RoleHealthDecorModel) {
        const index = this._decors.indexOf(decor);
        if (index !== -1) {
            this._decors.splice(index, 1);
        }
    }

    constructor(props?: {
        origin?: number;
        decors?: RoleHealthDecorModel[];
        current?: number;
    }) {
        super();
        this._origin = props?.origin ?? 1;
        this._decors = props?.decors ?? [];
        this._current = props?.current ?? this.origin;
    }   
}
