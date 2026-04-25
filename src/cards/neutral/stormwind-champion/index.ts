import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../rules/class";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { StormwindChampionFeatModel } from "./feat";
import { RarityType } from "../../../rules/rarity";

export class StormwindChampionModel extends MinionModel {
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 6 }),
                health: new RoleHealthModel({ origin: 6 }),
            }),
            cost: new CostModel({ origin: 7 }),
            rarity: RarityType.COMMON,
            races: [],
            feats: [new StormwindChampionFeatModel()],
        });
        this.init();
    }
}
