import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../utils/enums";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { RarityType } from "../../../utils/enums";
import { KoboldGeomancerFeatModel } from "./feat";

@useModel('kobold-geomancer-model')
export class KoboldGeomancerModel extends MinionModel {
    protected _brand: symbol = Symbol('kobold-geomancer-model');
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
            feats: [new KoboldGeomancerFeatModel()],
        });
        
    }
}
