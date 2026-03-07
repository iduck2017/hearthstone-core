import { MinionModel } from "../../../entities/minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";

export class SquireModel extends MinionModel {
    constructor() {
        super({
            attack: new RoleAttackModel({ origin: 2 }),
            health: new RoleHealthModel({ origin: 2 }),
            cost: new CostModel({ origin: 0 }),
        });
    }
}
