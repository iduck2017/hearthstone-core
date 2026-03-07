import { MinionModel } from "../../../entities/minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ChargeModel } from "../../../rules/charge";
import { CostModel } from "../../../rules/cost";

export class WolfriderModel extends MinionModel {
    constructor() {
        super({
            attack: new RoleAttackModel({ origin: 3 }),
            health: new RoleHealthModel({ origin: 1 }),
            charge: new ChargeModel({ isActived: true }),
            cost: new CostModel({ origin: 3 }),
        });
    }
}
