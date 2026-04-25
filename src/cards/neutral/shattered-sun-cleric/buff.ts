import { useMemo, useRoute } from "set-piece";
import { FeatureModel } from "../../../features";
import { RoleModel } from "../../../entities/role";
import { BuffOperatorType, RoleAttackDecor, useRoleAttackDecorConsumer } from "../../../decors/role-attack";
import { RoleHealthDecor, useRoleHealthDecorConsumer } from "../../../decors/role-health";

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

    @useRoleAttackDecorConsumer()
    protected _modifyRoleCurrentAttack(decor: RoleAttackDecor) {
        decor.addBuff({
            value: 1,
            type: BuffOperatorType.COMMON,
            source: this,
        });
    }

    @useRoleHealthDecorConsumer()
    protected _modifyRoleMaximumHealth(decor: RoleHealthDecor) {
        decor.addBuff({
            value: 1,
            type: BuffOperatorType.COMMON,
            source: this,
        });
    }
}
