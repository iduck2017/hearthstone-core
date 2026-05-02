import { useRoute, useState, Model, useMemo, useModel } from "set-piece";
import { RoleModel } from "../entities/role";
import { RoleActionModel } from "./role-action";
import { AsleepDecor, useAsleepDecorConsumer } from "../rules/role-action";
import { FeatModel } from "..";

@useModel('rush-model')
export class RushModel extends FeatModel {
    protected _brand: symbol = Symbol('rush-model');

    @useRoute(() => RoleModel)
    private _role?: RoleModel;
    @useMemo()
    public get role() {
        return this._role;
    }

    @useAsleepDecorConsumer()
    protected handleAsleepCheck(decor: AsleepDecor) {
        if (!this.isActived) return;
        decor.wakeup()
    }
}
