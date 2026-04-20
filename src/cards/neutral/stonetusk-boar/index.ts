import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ChargeModel } from "../../../rules/charge";
import { CostModel } from "../../../rules/cost";
import { MinionModel } from "../../minion";
import { RoleModel } from "../../../entities/role";

export class StonetuskBoarModel extends MinionModel {
    constructor() {
        super({
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 1 }),
                health: new RoleHealthModel({ origin: 1 }),
                charge: new ChargeModel({ isActived: true }),
            }),
            cost: new CostModel({ origin: 1 }),
        });
    }
}
