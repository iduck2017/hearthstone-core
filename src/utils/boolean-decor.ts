import { asState, Model } from "set-piece";

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

    @asState()
    private _type: BooleanDecorType;
    public get type() {
        return this._type;
    }

    @asState()
    private _value: boolean;
    public get value() {
        return this._value;
    }
}