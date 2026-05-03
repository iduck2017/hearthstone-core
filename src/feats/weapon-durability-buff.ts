import { useMemo, useRoute, useState, useModel, useDecorConsumer } from "set-piece";
import { SubFeatModel } from ".";
import { BuffOperatorType } from "../decors/role-attack";
import { WeaponModel } from "../cards/weapon";
import { WeaponDurabilityDecor } from "../rules/weapon-durability";

@useModel('weapon-durability-buff-model')
export class WeaponDurabilityBuffModel extends SubFeatModel {
    protected _brand: symbol = Symbol('weapon-durability-buff-model');
    @useState()
    public offset: number;

    constructor(offset: number) {
        super();
        this.offset = offset;
    }

    @useRoute(() => WeaponModel)
    private _weapon?: WeaponModel;
    @useMemo()
    public get weapon() {
        return this._weapon;
    }

    @useDecorConsumer((i: WeaponDurabilityBuffModel) => {
        if (!i.feat?.isActived) return;
        return [i._weapon?.durability, WeaponDurabilityDecor];
    })
    protected _modifyWeaponDurability(decor: WeaponDurabilityDecor) {
        decor.addBuff({
            value: this.offset,
            type: BuffOperatorType.COMMON,
            source: this,
        });
    }
}
