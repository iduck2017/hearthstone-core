import { useRoute, useState, Model } from "set-piece";
import { RoleModel } from "../entities/role";
import { RoleActionModel } from "./role-action";
import { onSleepStatusCalc, SleepDecor } from "../utils/sleep-decor";

export class RushModel extends Model {
    constructor(props?: {
        isActived?: boolean;
    }) {
        super();
        this._isActived = props?.isActived ?? false;
    }

    @useRoute(() => RoleModel)
    private _role?: RoleModel;
    public get role() {
        return this._role;
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


    @onSleepStatusCalc(s => s.role) 
    private handleSleepStatusCalc(target: RoleActionModel, decor: SleepDecor) {
        if (!this.isActived) return;
        console.log('Handle charge check')
        decor.result = false;
    }
}
