import { useDep, useRoute, useState, CustomDecor, Model, useMemo, useDecorProducer, useModel } from "set-piece";
import { RoleModel } from "../entities/role";
import { AsleepDecor, useAsleepDecorConsumer } from "../decors/asleep";
import { ChargeActiveDecor } from "../decors/charge-active";

@useModel('charge-model')
export class ChargeModel extends Model {
    protected _brand: symbol = Symbol('charge-model');
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

    @useDecorProducer(() => ChargeActiveDecor)
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
        console.log('wake up')
        decor.result = false;
    }
}
