import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { InjuredBlademasterBattlecryModel } from "./battlecry";

export class InjuredBlademasterModel extends MinionModel {
    constructor() {
        super({
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 4 }),
                health: new RoleHealthModel({ origin: 7 }),
            }),
            cost: new CostModel({ origin: 3 }),
            feats: [new InjuredBlademasterBattlecryModel()],
        });
    }
}
