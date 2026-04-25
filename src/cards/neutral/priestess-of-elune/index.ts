import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { PriestessOfEluneBattlecryModel } from "./battlecry";

export class PriestessOfEluneModel extends MinionModel {
    constructor() {
        super({
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 5 }),
                health: new RoleHealthModel({ origin: 4 }),
            }),
            cost: new CostModel({ origin: 6 }),
            feats: [new PriestessOfEluneBattlecryModel()],
        });
    }
}
