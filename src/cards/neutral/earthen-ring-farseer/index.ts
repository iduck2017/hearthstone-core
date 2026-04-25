import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { EarthenRingFarseerBattlecryModel } from "./battlecry";

export class EarthenRingFarseerModel extends MinionModel {
    constructor() {
        super({
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 3 }),
                health: new RoleHealthModel({ origin: 3 }),
            }),
            cost: new CostModel({ origin: 3 }),
            feats: [new EarthenRingFarseerBattlecryModel()],
        });
    }
}
