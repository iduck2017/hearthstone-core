import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleModel } from "../../../entities/role";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { ClassType } from "../../../rules/class";
import { RarityType } from "../../../rules/rarity";
import { VioletTeacherFeatModel } from "./feat";

@useModel('violet-teacher-model')
export class VioletTeacherModel extends MinionModel {
    protected _brand: symbol = Symbol('violet-teacher-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 3 }),
                health: new RoleHealthModel({ origin: 5 }),
            }),
            cost: new CostModel({ origin: 4 }),
            rarity: RarityType.RARE,
            races: [],
            feats: [new VioletTeacherFeatModel()],
        });
    }
}
