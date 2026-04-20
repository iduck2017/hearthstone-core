import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { RushModel } from "../../../rules/rush";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";

export class EmeraldSkytalonModel extends MinionModel {
    constructor() {
        super({
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 2 }),
                health: new RoleHealthModel({ origin: 1 }),
                rush: new RushModel({ isActived: true }),
            }),
            cost: new CostModel({ origin: 1 }),
        });
    }
}
