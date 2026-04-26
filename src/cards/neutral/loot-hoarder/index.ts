import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../rules/class";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { LootHoarderDeathrattleModel } from "./deathrattle";
import { RarityType } from "../../../rules/rarity";

@useModel('loot-hoarder-model')
export class LootHoarderModel extends MinionModel {
    protected _brand: symbol = Symbol('loot-hoarder-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 2 }),
                health: new RoleHealthModel({ origin: 1 }),
            }),
            cost: new CostModel({ origin: 2 }),
            rarity: RarityType.BASIC,
            races: [],
            feats: [
                new LootHoarderDeathrattleModel(),
            ],
        });
        
    }
}
