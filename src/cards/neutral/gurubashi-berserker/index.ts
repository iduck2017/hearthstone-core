import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../utils/enums";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { GurubashiBerserkerFeatModel } from "./feat";
import { RarityType } from "../../../utils/enums";

@useModel('gurubashi-berserker-model')
export class GurubashiBerserkerModel extends MinionModel {
    protected _brand: symbol = Symbol('gurubashi-berserker-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 2 }),
                health: new RoleHealthModel({ origin: 7 }),
            }),
            cost: new CostModel({ origin: 5 }),
            rarity: RarityType.COMMON,
            races: [],
            feats: [new GurubashiBerserkerFeatModel()],
        });
        
    }
}
