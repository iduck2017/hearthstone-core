import { AbstractConstructor } from "set-piece/dist/types";
import { RoleFeatureModel } from "../features";
import { BuffOperatorType, RoleAttackDecor, useRoleAttackDecorConsumer } from "../decors/role-attack";
import { RoleAttackModel } from "../rules/role-attack";

export function useRoleAttackBuff(value: number) {
    return function(BaseModel: AbstractConstructor<RoleFeatureModel>): any {
        class _RoleAttackBuffModel extends BaseModel {
            @useRoleAttackDecorConsumer()
            protected _modifyRoleCurrentAttack(decor: RoleAttackDecor, target: RoleAttackModel) {
                decor.addBuff({
                    value: value,
                    type: BuffOperatorType.COMMON,
                    source: this,
                });
            }
        }
        return _RoleAttackBuffModel;
    }
}
