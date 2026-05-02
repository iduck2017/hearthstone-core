import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../utils/enums";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { RaidLeaderFeatModel } from "./feat";
import { RarityType } from "../../../utils/enums";

@useModel('raid-leader-model')
export class RaidLeaderModel extends MinionModel {
    protected _brand: symbol = Symbol('raid-leader-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 2 }),
                health: new RoleHealthModel({ origin: 2 }),
            }),
            cost: new CostModel({ origin: 2 }),
            rarity: RarityType.COMMON,
            races: [],
            feats: [new RaidLeaderFeatModel()],
        });
        
    }
}
