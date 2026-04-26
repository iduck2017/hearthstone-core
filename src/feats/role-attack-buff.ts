import { Model, useMemo, useRoute, useState, useModel } from "set-piece";
import { FeatModel } from ".";
import { BuffOperatorType, RoleAttackDecor, useRoleAttackDecorConsumer } from "../decors/role-attack";
import { MinionModel } from "../cards/minion";
import { HeroModel } from "../heroes";
import { RoleModel } from "../entities/role";

@useModel('role-attack-buff-model')
export class RoleAttackBuffModel extends Model {
    protected _brand: symbol = Symbol('role-attack-buff-model');
    @useState()
    public offset: number;

    constructor(offset: number) {
        super();
        this.offset = offset;
        
    }

    @useRoute(() => FeatModel)
    private _feat?: FeatModel;
    public get feat() {
        return this._feat;
    }

    @useRoute(() => MinionModel)
    private _minion?: MinionModel;
    @useRoute(() => HeroModel)
    private _hero?: HeroModel;
    @useMemo()
    public get role() {
        return this._minion?.role ?? this._hero?.role;
    }

    @useRoleAttackDecorConsumer()
    protected _modifyRoleCurrentAttack(decor: RoleAttackDecor) {
        decor.addBuff({
            value: this.offset,
            type: BuffOperatorType.COMMON,
            source: this,
        });
    }
}