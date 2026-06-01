import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleModel } from "../../../entities/role";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { ClassType, RarityType } from "../../../utils/enums";
import { PintSizedSummonerFeatModel } from "./feat";

@useModel('pint-sized-summoner-model')
export class PintSizedSummonerModel extends MinionModel {
    protected _brand: symbol = Symbol('pint-sized-summoner-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 2 }),
                health: new RoleHealthModel({ origin: 2 }),
            }),
            cost: new CostModel({ origin: 2 }),
            rarity: RarityType.RARE,
            races: [],
            feats: [new PintSizedSummonerFeatModel()],
        });
    }
}
