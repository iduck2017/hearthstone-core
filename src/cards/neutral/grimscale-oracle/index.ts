import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../rules/class";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { RaceType } from "../../../rules/race";
import { RarityType } from "../../../rules/rarity";
import { GrimscaleOracleFeatModel } from "./feat";

@useModel('grimscale-oracle-model')
export class GrimscaleOracleModel extends MinionModel {
    protected _brand: symbol = Symbol('grimscale-oracle-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 1 }),
                health: new RoleHealthModel({ origin: 1 }),
            }),
            cost: new CostModel({ origin: 1 }),
            rarity: RarityType.COMMON,
            races: [RaceType.MURLOC],
            feats: [new GrimscaleOracleFeatModel()],
        });
        
    }
}
