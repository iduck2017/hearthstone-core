import { AbstractConstructor } from "set-piece/dist/types";
import { FeatureModel, RoleFeatureModel } from "../features";
import { BuffOperatorType, RoleAttackDecor, useRoleAttackDecorConsumer } from "../decors/role-attack";
import { useConsoleGroup } from "set-piece";

export function useRoleAttackBuff(value: number) {
    return function<T extends AbstractConstructor<RoleFeatureModel>>(BaseModel: T) {
        abstract class RoleAttackBuffModel extends BaseModel {
            @useRoleAttackDecorConsumer()
            protected _modifyRoleCurrentAttack(decor: RoleAttackDecor) {
                decor.addBuff({
                    value: value,
                    type: BuffOperatorType.COMMON,
                    source: this,
                });
            }
        }
        return RoleAttackBuffModel as T;
    }
}
