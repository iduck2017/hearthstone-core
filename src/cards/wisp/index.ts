import { RoleAttackModel } from "../../rules/role-attack";
import { RoleHealthModel } from "../../rules/role-health";
import { MinionModel } from "../../entities/minion";
import { CostModel } from "../../rules/cost";

export class WispModel extends MinionModel {
    constructor() {
        super({
            attack: new RoleAttackModel({ origin: 1 }),
            health: new RoleHealthModel({ origin: 1 }), 
            cost: new CostModel({ origin: 0 }),
        })
    }   
}