import { MinionModel } from "../../../entities/minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { StealthModel } from "../../../rules/stealth";
import { CostModel } from "../../../rules/cost";

export class RavenholdtAssassinModel extends MinionModel {
    constructor() {
        super({
            attack: new RoleAttackModel({ origin: 7 }),
            health: new RoleHealthModel({ origin: 5 }),
            stealth: new StealthModel({ isActived: true }),
            cost: new CostModel({ origin: 7 }),
        });
    }
}
