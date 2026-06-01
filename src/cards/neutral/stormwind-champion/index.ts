import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../utils/enums";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { StormwindChampionFeatModel } from "./feat";
import { RarityType } from "../../../utils/enums";

@useModel('stormwind-champion-model')
export class StormwindChampionModel extends MinionModel {
    protected _brand: symbol = Symbol('stormwind-champion-model');
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
        
    }
}
