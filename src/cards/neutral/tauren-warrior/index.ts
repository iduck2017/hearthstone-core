import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { TauntModel } from "../../../rules/taunt";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { TaurenWarriorFeatModel } from "./feat";

export class TaurenWarriorModel extends MinionModel {
    constructor() {
        super({
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 2 }),
                health: new RoleHealthModel({ origin: 3 }),
                taunt: new TauntModel({ isActived: true }),
            }),
            cost: new CostModel({ origin: 3 }),
            feats: [new TaurenWarriorFeatModel()],
        });
    }
}
