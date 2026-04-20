import { useState, Model, useMemo } from "set-piece";

export class DivineShieldModel extends Model {
    constructor(props?: {
        isActived?: boolean;
    }) {
        super();
        this._isActived = props?.isActived ?? false;
        this.init();
    }

    @useState()
    private _isActived: boolean;

    @useMemo()
    public get isActived() {
        return this._isActived;
    }

    public restore() {
        this._isActived = true;
    }

    public consume() {
        this._isActived = false;
    }
}
