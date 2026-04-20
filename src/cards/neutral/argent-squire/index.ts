import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { DivineShieldModel } from "../../../rules/divine-shield";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";

export class ArgentSquireModel extends MinionModel {
    constructor() {
        super({
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 1 }),
                health: new RoleHealthModel({ origin: 1 }),
                divineShield: new DivineShieldModel({ isActived: true }),
            }),
            cost: new CostModel({ origin: 1 }),
        });
    }
}
