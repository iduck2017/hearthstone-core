import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../rules/class";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { RaceType } from "../../../rules/race";
import { RarityType } from "../../../rules/rarity";

@useModel('oasis-snapjaw-model')
export class OasisSnapjawModel extends MinionModel {
    protected _brand: symbol = Symbol('oasis-snapjaw-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 2 }),
                health: new RoleHealthModel({ origin: 7 }),
            }),
            cost: new CostModel({ origin: 4 }),
            rarity: RarityType.COMMON,
            races: [RaceType.BEAST],
        });
        
    }
}
