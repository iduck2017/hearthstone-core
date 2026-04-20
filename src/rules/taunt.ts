import { useState, Model, useMemo } from "set-piece";

export class TauntModel extends Model {
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

    public active() {
        this._isActived = true;
    }

    public deactive() {
        this._isActived = false;
    }
}