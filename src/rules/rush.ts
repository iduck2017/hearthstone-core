import { useRoute, useState, Model, useMemo, useModel } from "set-piece";
import { RoleModel } from "../entities/role";
import { RoleActionModel } from "./role-action";
import { AsleepDecor, useAsleepDecorConsumer } from "../decors/asleep";

@useModel('rush-model')
export class RushModel extends Model {
    protected _brand: symbol = Symbol('rush-model');
    constructor(props?: {
        isActived?: boolean;
    }) {
        super();
        this._isActived = props?.isActived ?? false;
        
    }

    @useRoute(() => RoleModel)
    private _role?: RoleModel;
    @useMemo()
    public get role() {
        return this._role;
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


    @useAsleepDecorConsumer()
    private handleSleepStatusCalc(decor: AsleepDecor) {
        if (!this.isActived) return;
        console.log('Handle charge check')
        decor.result = false;
    }
}
