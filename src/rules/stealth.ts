import { useState, Model, useMemo, useModel } from "set-piece";

@useModel('stealth-model')
export class StealthModel extends Model {
    protected _brand: symbol = Symbol('stealth-model');
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
    
    public active() { this._isActived = true;  }
    public deactive() { this._isActived = false;  }
}
