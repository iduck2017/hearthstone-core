import { RoleAttackModel } from "../../../rules/role-attack";
import { CostModel } from "../../../rules/cost";
import { RoleHealthModel } from "../../../rules/role-health";
import { MinionModel } from "../../../entities/minion";
import { ElvenArcherBattlecryModel } from "./battlecry";

export class ElvenArcherModel extends MinionModel {
    constructor() {
        super({
            attack: new RoleAttackModel({ origin: 1 }),
            health: new RoleHealthModel({ origin: 1 }), 
            cost: new CostModel({ origin: 1 }),
            battlecries: [
                new ElvenArcherBattlecryModel(),
            ],
        })
    }
}