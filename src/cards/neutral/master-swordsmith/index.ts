import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleModel } from "../../../entities/role";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { ClassType, RarityType } from "../../../utils/enums";
import { MasterSmithFeatModel } from "./feat";

@useModel('master-swordsmith-model')
export class MasterSmithModel extends MinionModel {
    protected _brand: symbol = Symbol('master-swordsmith-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 1 }),
                health: new RoleHealthModel({ origin: 3 }),
            }),
            cost: new CostModel({ origin: 2 }),
            rarity: RarityType.RARE,
            races: [],
            feats: [new MasterSmithFeatModel()],
        });
    }
}
