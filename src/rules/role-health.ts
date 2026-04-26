import { Model, useChild, useDecorProducer, useDeferEffect, useDep, useEffect, useMemo, useRange, useState, useModel } from "set-piece";
import { RoleHealthDecor } from "../decors/role-health";

@useModel('role-health-model')
export class RoleHealthModel extends Model {
    protected _brand: symbol = Symbol('role-health-model');

    // Origin
    @useState()
    @useRange(0, undefined)
    private _origin: number;
    @useMemo()
    public get origin() {
        return this._origin;
    }

    // Current
    @useState()
    private _current: number;
    @useMemo()
    public get current() {
        return this._current;
    }

    public setCurrent(value: number) {
        this._current = this._maximum;
    }

    public consumeCurrent(value: number) {
        this._current -= value;
    }

    public restoreCurrent(value: number) {
        this._current += value;
        if (this._current > this._maximum) {
            this._current = this._maximum;
        }
    }

    private _prevMaximum?: number;
    @useEffect()
    private handleMaximumChange() {
        if (this._prevMaximum !== undefined) {
            const offset = this._maximum - this._prevMaximum;
            if (offset === 0)  return;
            console.log(`Handle maximum change: ${this._prevMaximum} -> ${this.maximum}`)
            if (offset > 0) this._current += offset;
            if (offset < 0) this._current = Math.min(this._current, this._maximum);
        }
        this._prevMaximum = this._maximum;
        return;
    }

    @useDeferEffect()
    private handleCurrentChangeDefer() {
        // console.log(`Handle current change defer ${this.current}/${this.maximum}`);
    }
    
    @useState()
    @useDecorProducer(() => RoleHealthDecor)
    private _maximum: number;
    @useMemo()
    public get maximum() {
        return this._maximum;
    }

    constructor(props?: {
        origin?: number;
        current?: number;
    }) {
        super();
        this._origin = props?.origin ?? 1;
        this._maximum = props?.origin ?? 1;
        this._current = props?.current ?? this.origin;
        
    }   
}
