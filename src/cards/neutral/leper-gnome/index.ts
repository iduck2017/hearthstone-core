import { MinionModel } from "../../minion";
import { RoleHealthModel } from "../../../rules/role-health";
import { RoleAttackModel } from "../../../rules/role-attack";
import { ClassType } from "../../../rules/class";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { LeperGnomeDeathrattleModel } from "./deathrattle";
import { RarityType } from "../../../rules/rarity";

export class LeperGnomeModel extends MinionModel {
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 2 }),
                health: new RoleHealthModel({ origin: 1 }),
            }),
            cost: new CostModel({ origin: 1 }),
            rarity: RarityType.BASIC,
            races: [],
            feats: [
                new LeperGnomeDeathrattleModel(),
            ],
        });
        this.init();
    }
}
