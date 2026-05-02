import { useDep, useRoute, useState, Model, useMemo, useDecorProducer, useModel, useDecorConsumer } from "set-piece";
import { RoleModel } from "../entities/role";
import { AsleepDecor, useAsleepDecorConsumer } from "../rules/role-action";
import { HeroSelectableDecor } from "./role-attack";
import { FeatModel } from "..";

@useModel('charge-model')
export class ChargeModel extends FeatModel {
    protected _brand: symbol = Symbol('charge-model');

    @useRoute(() => RoleModel)
    private _role?: RoleModel;
    @useMemo()
    public get role() { return this._role }

    @useAsleepDecorConsumer()
    protected _handleSleepStatusCalc(decor: AsleepDecor) {
        if (!this.isActived) return;
        console.log('wake up')
        decor.wakeup()
    }

    @useDecorConsumer(that => {
        const role = that.role;
        if (!role) return;
        if (!that.feat?.isActived) return;
        return [role?.attack, HeroSelectableDecor]
    })
    protected _handlerHeroSelectableCheck(decor: HeroSelectableDecor) {
        if (!this.isActived) return;
        decor.unlock()
    }
}