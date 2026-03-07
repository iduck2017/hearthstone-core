import { MinionModel } from "../../../entities/minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { DragonlingMechanicBattlecryModel } from "./battlecry";

export class DragonlingMechanicModel extends MinionModel {
    constructor() {
        super({
            attack: new RoleAttackModel({ origin: 2 }),
            health: new RoleHealthModel({ origin: 4 }),
            cost: new CostModel({ origin: 4 }),
            battlecries: [
                new DragonlingMechanicBattlecryModel(),
            ],
        });
    }
}
