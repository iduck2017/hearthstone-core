import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../rules/class";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { HarvestGolemDeathrattleModel } from "./deathrattle";
import { RaceType } from "../../../rules/race";
import { RarityType } from "../../../rules/rarity";

@useModel('harvest-golem-model')
export class HarvestGolemModel extends MinionModel {
    protected _brand: symbol = Symbol('harvest-golem-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 2 }),
                health: new RoleHealthModel({ origin: 3 }),
            }),
            cost: new CostModel({ origin: 3 }),
            rarity: RarityType.BASIC,
            races: [RaceType.MECH],
            feats: [
                new HarvestGolemDeathrattleModel(),
            ],
        });
        
    }
}
