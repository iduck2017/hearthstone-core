import { asState, Model } from "set-piece";

export enum NumberDecorType {
    OVERRIDE = 'override',
    BUFF = 'buff',
    AURA = 'aura',
}

export class NumberDecorModel extends Model {
    constructor(props: {
        type: NumberDecorType;
        value: number;
    }) {
        super();
        this._type = props.type;
        this._value = props.value;
    }

    @asState()  
    private _type: NumberDecorType;
    public get type() {
        return this._type;
    }

    @asState()
    private _value: number;
    public get value() {
        return this._value;
    }

}