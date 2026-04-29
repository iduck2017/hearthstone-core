import { useState, Model, useMemo, useModel } from "set-piece";

@useModel('taunt-model')
export class TauntModel extends Model {
    protected _brand: symbol = Symbol('taunt-model');
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
    public active() { this._isActived = true; }
    public deactive() { this._isActived = false; }
}