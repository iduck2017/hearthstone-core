import { MinionModel } from "../../../entities/minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { TauntModel } from "../../../rules/taunt";
import { CostModel } from "../../../rules/cost";

export class BootyBayBodyguardModel extends MinionModel {
    constructor() {
        super({
            attack: new RoleAttackModel({ origin: 5 }),
            health: new RoleHealthModel({ origin: 4 }),
            taunt: new TauntModel({ isActived: true }),
            cost: new CostModel({ origin: 5 }),
        });
    }
}
