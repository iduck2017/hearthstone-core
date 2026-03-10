import { useState, Model } from "set-piece";

export enum BooleanDecorType {
    BUFF = 'override',
    AURA = 'aura',
}

export class BooleanDecorModel extends Model {
    constructor(props: {
        type: BooleanDecorType;
        value: boolean;
    }) {
        super();
        this._type = props.type;
        this._value = props.value;
    }

    @useState()
    private _type: BooleanDecorType;
    public get type() {
        return this._type;
    }

    @useState()
    private _value: boolean;
    public get value() {
        return this._value;
    }
}

