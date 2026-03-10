import { asRoute, onMount, onUnmount } from "set-piece";
import { FeatureModel } from "../../../features";
import { RoleModel } from "../../../entities/role";
import { NumberDecorModel, NumberDecorType } from "../../../utils/number-decor";
import { MinionModel } from "../../../entities/minion";
import { HeroModel } from "../../../entities/hero";
import { useRoleAttackBuff } from "../../../utils/use-role-attack-buff";
import { useRoleHealthBuff } from "../../../utils/use-role-health-buff";

@useRoleHealthBuff(1)
@useRoleAttackBuff(1)
export class ShatteredSunClericBuffModel extends FeatureModel {
}