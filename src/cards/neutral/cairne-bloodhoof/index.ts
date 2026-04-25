import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../rules/class";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { CairneBloodhoofDeathrattleModel } from "./deathrattle";
import { RarityType } from "../../../rules/rarity";

export class CairneBloodhoofModel extends MinionModel {
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 5 }),
                health: new RoleHealthModel({ origin: 5 }),
            }),
            cost: new CostModel({ origin: 6 }),
            rarity: RarityType.LEGENDARY,
            races: [],
            feats: [new CairneBloodhoofDeathrattleModel()],
        });
        this.init();
    }
}
