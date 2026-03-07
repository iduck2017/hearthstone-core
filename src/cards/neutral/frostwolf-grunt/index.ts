import { MinionModel } from "../../../entities/minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { TauntModel } from "../../../rules/taunt";
import { CostModel } from "../../../rules/cost";

export class FrostwolfGruntModel extends MinionModel {
    constructor() {
        super({
            attack: new RoleAttackModel({ origin: 2 }),
            health: new RoleHealthModel({ origin: 2 }),
            taunt: new TauntModel({ isActived: true }),
            cost: new CostModel({ origin: 2 }),
        });
    }
}
