import { MinionModel } from "../../entities/minion";
import { RoleAttackModel } from "../../rules/role-attack";
import { RoleHealthModel } from "../../rules/role-health";
import { RushModel } from "../../rules/rush";
import { CostModel } from "../../rules/cost";

export class EmeraldSkytalonModel extends MinionModel {
    constructor() {
        super({
            attack: new RoleAttackModel({ origin: 2 }),
            health: new RoleHealthModel({ origin: 1 }),
            rush: new RushModel({ isActived: true }),
            cost: new CostModel({ origin: 1 }),
        });
    }
}
