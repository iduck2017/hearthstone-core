import { useState, Model } from "set-piece";

export class TauntModel extends Model {
    constructor(props?: {
        isActived?: boolean;
    }) {
        super();
        this._isActived = props?.isActived ?? false;
    }

    @useState()
    private _isActived: boolean;
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