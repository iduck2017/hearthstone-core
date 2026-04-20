import { MinionModel } from "../../minion";
import { RoleHealthModel } from "../../../rules/role-health";
import { RoleAttackModel } from "../../../rules/role-attack";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { LeperGnomeDeathrattleModel } from "./deathrattle";

export class LeperGnomeModel extends MinionModel {
    constructor() {
        super({
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 2 }),
                health: new RoleHealthModel({ origin: 1 }),
            }),
            cost: new CostModel({ origin: 1 }),
            features: [
                new LeperGnomeDeathrattleModel(),
            ],
        });
    }
}
