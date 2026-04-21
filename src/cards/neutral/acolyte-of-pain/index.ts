import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { AcolyteOfPainFeatureModel } from "./feature";

export class AcolyteOfPainModel extends MinionModel {
    constructor() {
        super({
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 1 }),
                health: new RoleHealthModel({ origin: 3 }),
                features: [new AcolyteOfPainFeatureModel()],
            }),
            cost: new CostModel({ origin: 3 }),
        });
    }
}
