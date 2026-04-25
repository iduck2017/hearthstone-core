import { AbstractConstructor } from "set-piece/dist/types";
import { FeatureModel, RoleFeatureModel } from "../features";
import { BuffOperatorType } from "../decors/role-attack";
import { RoleHealthDecor, useRoleHealthDecorConsumer } from "../decors/role-health";
import { RoleModel } from "../entities/role";

export function useRoleHealthBuff(value: number) {
    return function<T extends AbstractConstructor<RoleFeatureModel>>(BaseModel: T) {
        abstract class RoleHealthBuffModel extends BaseModel {
            @useRoleHealthDecorConsumer()
            protected _modifyRoleMaximumHealth(decor: RoleHealthDecor) {
                decor.addBuff({
                    value: value,
                    type: BuffOperatorType.COMMON,
                    source: this,
                })
            }
        }
        return RoleHealthBuffModel as T
    }
}


