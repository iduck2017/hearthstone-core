import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { ChargeModel } from "../../../rules/charge";
import { LeeroyJenkinsBattlecryModel } from "./battlecry";

export class LeeroyJenkinsModel extends MinionModel {
    constructor() {
        super({
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 6 }),
                health: new RoleHealthModel({ origin: 2 }),
                charge: new ChargeModel({ isActived: true }),
            }),
            cost: new CostModel({ origin: 5 }),
            features: [new LeeroyJenkinsBattlecryModel()],
        });
    }
}
