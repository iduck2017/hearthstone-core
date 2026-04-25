import { Model, useMemo, useRoute, useState } from "set-piece";
import { FeatModel } from ".";
import { BuffOperatorType, RoleAttackDecor, useRoleAttackDecorConsumer } from "../decors/role-attack";
import { MinionModel } from "../cards/minion";
import { HeroModel } from "../heroes";
import { RoleModel } from "../entities/role";

export class RoleAttackBuffModel extends Model {
    @useState()
    public offset: number;

    constructor(offset: number) {
        super();
        this.offset = offset;
        this.init();
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