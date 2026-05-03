import { useMemo, useRoute, useState, useModel, useDecorConsumer } from "set-piece";
import { SubFeatModel } from ".";
import { BuffOperatorType } from "../decors/role-attack";
import { WeaponModel } from "../cards/weapon";
import { WeaponAttackDecor } from "../rules/weapon-attack";

@useModel('weapon-attack-buff-model')
export class WeaponAttackBuffModel extends SubFeatModel {
    protected _brand: symbol = Symbol('weapon-attack-buff-model');
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

    @useDecorConsumer((i: WeaponAttackBuffModel) => {
        if (!i.feat?.isActived) return;
        return [i._weapon?.attack, WeaponAttackDecor];
    })
    protected _modifyWeaponAttack(decor: WeaponAttackDecor) {
        decor.addBuff({
            value: this.offset,
            type: BuffOperatorType.COMMON,
            source: this,
        });
    }
}
