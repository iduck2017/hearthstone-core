import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../utils/enums";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { RaceType } from "../../../utils/enums";
import { RarityType } from "../../../utils/enums";
import { ColdlightOracleBattlecryModel } from "./battlecry";

@useModel('coldlight-oracle-model')
export class ColdlightOracleModel extends MinionModel {
    protected _brand: symbol = Symbol('coldlight-oracle-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 2 }),
                health: new RoleHealthModel({ origin: 2 }),
            }),
            cost: new CostModel({ origin: 3 }),
            rarity: RarityType.RARE,
            races: [RaceType.MURLOC],
            feats: [new ColdlightOracleBattlecryModel()],
        });

    }
}
