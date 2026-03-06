import { MinionModel } from "../../entities/minion";
import { RoleAttackModel } from "../../rules/role-attack";
import { RoleHealthModel } from "../../rules/role-health";
import { StealthModel } from "../../rules/stealth";
import { CostModel } from "../../rules/cost";

export class WorgenInfiltratorModel extends MinionModel {
    constructor() {
        super({
            attack: new RoleAttackModel({ origin: 2 }),
            health: new RoleHealthModel({ origin: 1 }),
            stealth: new StealthModel({ isActived: true }),
            cost: new CostModel({ origin: 1 }),
        });
    }
}
