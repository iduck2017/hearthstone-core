import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../rules/class";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { RaceType } from "../../../rules/race";
import { RarityType } from "../../../rules/rarity";

@useModel('bloodfen-raptor-model')
export class BloodfenRaptorModel extends MinionModel {
    protected _brand: symbol = Symbol('bloodfen-raptor-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 3 }),
                health: new RoleHealthModel({ origin: 2 }),
            }),
            cost: new CostModel({ origin: 2 }),
            rarity: RarityType.COMMON,
            races: [RaceType.BEAST],
        });
        
    }
}
