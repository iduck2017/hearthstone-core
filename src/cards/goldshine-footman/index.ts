import { MinionModel } from "../../entities/minion";
import { RoleAttackModel } from "../../rules/role-attack";
import { RoleHealthModel } from "../../rules/role-health";
import { TauntModel } from "../../rules/taunt";
import { CostModel } from "../../rules/cost";

export class GoldshineFootmanModel extends MinionModel {
    constructor() {
        super({
            attack: new RoleAttackModel({ origin: 1 }),
            health: new RoleHealthModel({ origin: 2 }),
            taunt: new TauntModel({ isActive: true }),
            cost: new CostModel({ origin: 1 }),
        });
    }
}