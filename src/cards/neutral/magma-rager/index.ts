import { MinionModel } from "../../../entities/minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";

export class MagmaRagerModel extends MinionModel {
    constructor() {
        super({
            attack: new RoleAttackModel({ origin: 5 }),
            health: new RoleHealthModel({ origin: 1 }),
            cost: new CostModel({ origin: 3 }),
        });
    }
}
