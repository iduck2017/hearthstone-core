import { useDep, useRoute, useState, CustomDecor, Model, useMemo } from "set-piece";
import { RoleModel } from "../entities/role";
import { AsleepDecor, useAsleepDecorConsumer } from "../decors/asleep";
import { RoleActionModel } from "./role-action";

export class ChargeModel extends Model {
    constructor(props?: {
        isActived?: boolean;
    }) {
        super();
        this._isActived = props?.isActived ?? false;
        this.init();
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
    private handleSleepStatusCalc(decor: AsleepDecor, target: RoleActionModel) {
        if (!this.isActived) return;
        console.log('Handle charge check')
        decor.result = false;
    }
}
