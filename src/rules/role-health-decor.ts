import { Model, asRoute, asState } from "set-piece";
import { RoleHealthModel } from "./role-health";

export enum RoleHealthDecorType {
    OVERRIDE = 'override',
    BUFF = 'buff',
}

export class RoleHealthDecorModel extends Model {
    
    @asRoute(() => RoleHealthModel)
    private _health?: RoleHealthModel;
    public get health() {
        return this._health;
    }

    @asState()
    private _type: RoleHealthDecorType;
    public get type() {
        return this._type;
    }

    @asState()
    private _value: number;
    public get value() {
        return this._value;
    }   

    constructor(props: {
        type: RoleHealthDecorType;
        value: number;
    }) {
        super();
        this._type = props.type;
        this._value = props.value;
    }
}
