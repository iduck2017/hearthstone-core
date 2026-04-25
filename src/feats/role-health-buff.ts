import { Model, useState, useRoute, useMemo } from "set-piece";
import { FeatModel, RoleFeatureModel } from ".";
import { BuffOperatorType, BuffOperator } from "../decors/role-attack";
import { RoleHealthDecor, useRoleHealthDecorConsumer } from "../decors/role-health";
import { RoleModel } from "../entities/role";
import { MinionModel } from "../cards/minion";
import { HeroModel } from "../heroes";

export class RoleHealthBuffModel extends Model {
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

    @useRoleHealthDecorConsumer()
    protected _modifyRoleMaximumHealth(decor: RoleHealthDecor) {
        decor.addBuff({
            value: this.offset,
            type: BuffOperatorType.COMMON,
            source: this,
        });
    }
}
