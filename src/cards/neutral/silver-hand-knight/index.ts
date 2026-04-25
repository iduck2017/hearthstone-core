import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { SilverHandKnightBattlecryModel } from "./battlecry";

export class SilverHandKnightModel extends MinionModel {
    constructor() {
        super({
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 4 }),
                health: new RoleHealthModel({ origin: 4 }),
            }),
            cost: new CostModel({ origin: 5 }),
            feats: [
                new SilverHandKnightBattlecryModel(),
            ],
        });
    }
}
