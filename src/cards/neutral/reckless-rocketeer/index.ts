import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ChargeModel } from "../../../rules/charge";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";

export class RecklessRocketeerModel extends MinionModel {
    constructor() {
        super({
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 5 }),
                health: new RoleHealthModel({ origin: 2 }),
                charge: new ChargeModel({ isActived: true }),
            }),
            cost: new CostModel({ origin: 6 }),
        });
    }
}
