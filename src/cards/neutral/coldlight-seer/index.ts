import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { ClassType, RarityType, RaceType } from "../../../utils/enums";
import { RoleModel } from "../../../entities/role";
import { ColdlightSeerBattlecryModel } from "./battlecry";

@useModel('coldlight-seer-model')
export class ColdlightSeerModel extends MinionModel {
    protected _brand: symbol = Symbol('coldlight-seer-model');

    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 2 }),
                health: new RoleHealthModel({ origin: 3 }),
            }),
            cost: new CostModel({ origin: 3 }),
            rarity: RarityType.RARE,
            races: [RaceType.MURLOC],
            feats: [new ColdlightSeerBattlecryModel()],
        });
    }
}
