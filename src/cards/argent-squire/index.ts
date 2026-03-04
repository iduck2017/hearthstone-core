import { MinionModel } from "../../entities/minion";
import { RoleAttackModel } from "../../rules/role-attack";
import { RoleHealthModel } from "../../rules/role-health";
import { DivineShieldModel } from "../../rules/divine-shield";
import { CostModel } from "../../rules/cost";

export class ArgentSquireModel extends MinionModel {
    constructor() {
        super({
            attack: new RoleAttackModel({ origin: 1 }),
            health: new RoleHealthModel({ origin: 1 }),
            divineShield: new DivineShieldModel({ isActive: true }),
            cost: new CostModel({ origin: 1 }),
        });
    }
}
