import { useState, Model, useMemo, useModel } from "set-piece";

@useModel('divine-shield-model')
export class DivineShieldModel extends Model {
    protected _brand: symbol = Symbol('divine-shield-model');
    
    constructor(props?: {
        isActived?: boolean;
    }) {
        super();
        this._isActived = props?.isActived ?? false;
    }

    @useState()
    private _isActived: boolean;
    @useMemo()
    public get isActived() {
        return this._isActived;
    }
    public restore() { this._isActived = true; }
    public consume() { this._isActived = false; }

}
