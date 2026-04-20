import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { AngryChickenFeatureModel } from "./feature";
import { RoleModel } from "../../../entities/role";

export class AngryChickenModel extends MinionModel {
    constructor() {
        super({
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 1 }),
                health: new RoleHealthModel({ origin: 1 }),
                features: [new AngryChickenFeatureModel()],
            }),
            cost: new CostModel({ origin: 1 }),
        });
        this.init()
    }
}
