import { MinionModel } from "../../../entities/minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { SilverHandKnightBattlecryModel } from "./battlecry";

export class SilverHandKnightModel extends MinionModel {
    constructor() {
        super({
            attack: new RoleAttackModel({ origin: 4 }),
            health: new RoleHealthModel({ origin: 4 }),
            cost: new CostModel({ origin: 5 }),
            battlecries: [
                new SilverHandKnightBattlecryModel(),
            ],
        });
    }
}
