import { MinionModel } from "../../../entities/minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { RazorfenHunterBattlecryModel } from "./battlecry";

export class RazorfenHunterModel extends MinionModel {
    constructor() {
        super({
            attack: new RoleAttackModel({ origin: 2 }),
            health: new RoleHealthModel({ origin: 3 }),
            cost: new CostModel({ origin: 3 }),
            battlecries: [
                new RazorfenHunterBattlecryModel(),
            ],
        });
    }
}
