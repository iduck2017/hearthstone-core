import { MinionModel } from "../../../entities/minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";

export class CoreHoundModel extends MinionModel {
    constructor() {
        super({
            attack: new RoleAttackModel({ origin: 9 }),
            health: new RoleHealthModel({ origin: 5 }),
            cost: new CostModel({ origin: 7 }),
        });
    }
}
