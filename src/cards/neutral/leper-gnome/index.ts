import { MinionModel } from "../../../entities/minion";
import { RoleHealthModel } from "../../../rules/role-health";
import { RoleAttackModel } from "../../../rules/role-attack";
import { CostModel } from "../../../rules/cost";
import { LeperGnomeDeathrattleModel } from "./deathrattle";

export class LeperGnomeModel extends MinionModel {
    constructor() {
        super({
            attack: new RoleAttackModel({ origin: 2 }),
            health: new RoleHealthModel({ origin: 1 }),
            cost: new CostModel({ origin: 1 }),
            deathrattles: [
                new LeperGnomeDeathrattleModel()
            ]
        });
    }
}