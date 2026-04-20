import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { StealthModel } from "../../../rules/stealth";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";

export class RavenholdtAssassinModel extends MinionModel {
    constructor() {
        super({
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 7 }),
                health: new RoleHealthModel({ origin: 5 }),
                stealth: new StealthModel({ isActived: true }),
            }),
            cost: new CostModel({ origin: 7 }),
        });
    }
}
