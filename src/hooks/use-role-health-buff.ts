import { AbstractConstructor } from "set-piece/dist/types";
import { FeatureModel, RoleFeatureModel } from "../features";
import { BuffOperatorType } from "../decors/role-attack";
import { RoleHealthDecor, useRoleHealthDecorConsumer } from "../decors/role-health";
import { RoleHealthModel } from "../rules/role-health";

export function useRoleHealthBuff(value: number) {
    return function(BaseModel: AbstractConstructor<RoleFeatureModel>): any {
        class _RoleHealthBuffModel extends BaseModel {
            @useRoleHealthDecorConsumer()
            protected _modifyRoleMaximumHealth(decor: RoleHealthDecor, target: RoleHealthModel) {
                decor.addBuff({
                    value: value,
                    type: BuffOperatorType.COMMON,
                    source: this,
                })
            }
        }
        return _RoleHealthBuffModel;
    }
}