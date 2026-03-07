import { MinionModel } from "../../../entities/minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { IronforgeRiflemanBattlecryModel } from "./battlecry";

export class IronforgeRiflemanModel extends MinionModel {
    constructor() {
        super({
            attack: new RoleAttackModel({ origin: 2 }),
            health: new RoleHealthModel({ origin: 2 }),
            cost: new CostModel({ origin: 3 }),
            battlecries: [
                new IronforgeRiflemanBattlecryModel(),
            ],
        });
    }
}
