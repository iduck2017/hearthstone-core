import { MinionModel } from "../../entities/minion";
import { RoleAttackModel } from "../../rules/role-attack";
import { RoleHealthModel } from "../../rules/role-health";
import { CostModel } from "../../rules/cost";

export class WarGolemModel extends MinionModel {
    constructor() {
        super({
            attack: new RoleAttackModel({ origin: 7 }),
            health: new RoleHealthModel({ origin: 7 }),
            cost: new CostModel({ origin: 7 }),
        });
    }
}
