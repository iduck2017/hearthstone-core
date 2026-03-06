import { Model, asRoute, asState } from "set-piece";
import { RoleAttackModel } from "./role-attack";

export enum RoleAttackDecorType {
    OVERRIDE = 'override',
    BUFF = 'buff',
}

export class RoleAttackDecorModel extends Model {
    
    @asRoute(() => RoleAttackModel)
    private _attack?: RoleAttackModel;
    public get attack() {
        return this._attack;
    }

    @asState()
    private _type: RoleAttackDecorType;
    public get type() {
        return this._type;
    }

    @asState()
    private _value: number;
    public get value() {
        return this._value;
    }   

    constructor(props: {
        type: RoleAttackDecorType;
        value: number;
    }) {
        super();
        this._type = props.type;
        this._value = props.value;
    }
}