import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { ClassType, RarityType } from "../../../utils/enums";
import { RoleModel } from "../../../entities/role";
import { TauntModel } from "../../../rules/taunt";
import { AbominationDeathrattleModel } from "./deathrattle";

@useModel('abomination-model')
export class AbominationModel extends MinionModel {
    protected _brand: symbol = Symbol('abomination-model');

    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 4 }),
                health: new RoleHealthModel({ origin: 4 }),
                taunt: new TauntModel({ isActived: true }),
            }),
            cost: new CostModel({ origin: 5 }),
            rarity: RarityType.RARE,
            races: [],
            feats: [new AbominationDeathrattleModel()],
        });
    }
}
