import { MinionModel } from "../../../entities/minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { AbusiveSergeantBattlecryModel } from "./battlecry";

export class AbusiveSergeantModel extends MinionModel {
    constructor() {
        super({
            attack: new RoleAttackModel({ origin: 2 }),
            health: new RoleHealthModel({ origin: 1 }),
            cost: new CostModel({ origin: 1 }),
            battlecries: [
                new AbusiveSergeantBattlecryModel(),
            ],
        });
    }
}
