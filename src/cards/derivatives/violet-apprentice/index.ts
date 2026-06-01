import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleModel } from "../../../entities/role";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { ClassType } from "../../../utils/enums";
import { RarityType } from "../../../utils/enums";

@useModel('violet-apprentice-model')
export class VioletApprenticeModel extends MinionModel {
    protected _brand: symbol = Symbol('violet-apprentice-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 1 }),
                health: new RoleHealthModel({ origin: 1 }),
            }),
            cost: new CostModel({ origin: 0 }),
            rarity: RarityType.COMMON,
            races: [],
        });
    }
}
