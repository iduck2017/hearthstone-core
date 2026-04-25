import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { GurubashiBerserkerFeatModel } from "./feat";

export class GurubashiBerserkerModel extends MinionModel {
    constructor() {
        super({
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 2 }),
                health: new RoleHealthModel({ origin: 7 }),
            }),
            cost: new CostModel({ origin: 5 }),
            feats: [new GurubashiBerserkerFeatModel()],
        });
    }
}
