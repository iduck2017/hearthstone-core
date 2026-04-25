import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { AngryChickenFeatModel } from "./feat";
import { RoleModel } from "../../../entities/role";

export class AngryChickenModel extends MinionModel {
    constructor() {
        super({
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 1 }),
                health: new RoleHealthModel({ origin: 1 }),
            }),
            cost: new CostModel({ origin: 1 }),
            feats: [new AngryChickenFeatModel()],
        });
        this.init()
    }
}
