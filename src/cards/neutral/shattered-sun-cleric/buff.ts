import { useMemo, useRoute } from "set-piece";
import { FeatureModel } from "../../../features";
import { RoleModel } from "../../../entities/role";
import { BuffOperatorType, RoleCurrentAttackDecor, useRoleCurrentAttackDecorConsumer } from "../../../decors/role-current-attack";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleMaximumHealthDecor, useRoleMaximumHealthDecorConsumer } from "../../../decors/role-maximum-health";
import { RoleHealthModel } from "../../../rules/role-health";

export class ShatteredSunClericBuffModel extends FeatureModel {
    @useRoute(() => RoleModel)
    private _role?: RoleModel;
    @useMemo()
    public get role() {
        return this._role;
    }

    constructor() {
        super();
        this.init();
    }

    @useRoleCurrentAttackDecorConsumer()
    protected _modifyRoleCurrentAttack(decor: RoleCurrentAttackDecor, _target: RoleAttackModel) {
        decor.addBuff({
            value: 1,
            type: BuffOperatorType.COMMON,
            source: this,
        });
    }

    @useRoleMaximumHealthDecorConsumer()
    protected _modifyRoleMaximumHealth(decor: RoleMaximumHealthDecor, _target: RoleHealthModel) {
        decor.addBuff({
            value: 1,
            type: BuffOperatorType.COMMON,
            source: this,
        });
    }
}
