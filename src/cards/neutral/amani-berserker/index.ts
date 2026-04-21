import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { AmaniBerserkerFeatureModel } from "./feature";

export class AmaniBerserkerModel extends MinionModel {
    constructor() {
        super({
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 2 }),
                health: new RoleHealthModel({ origin: 3 }),
                features: [new AmaniBerserkerFeatureModel()],
            }),
            cost: new CostModel({ origin: 2 }),
        });
    }
}
