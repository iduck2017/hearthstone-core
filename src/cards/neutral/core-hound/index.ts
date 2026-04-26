import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../rules/class";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { RaceType } from "../../../rules/race";
import { RarityType } from "../../../rules/rarity";

@useModel('core-hound-model')
export class CoreHoundModel extends MinionModel {
    protected _brand: symbol = Symbol('core-hound-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 9 }),
                health: new RoleHealthModel({ origin: 5 }),
            }),
            cost: new CostModel({ origin: 7 }),
            rarity: RarityType.COMMON,
            races: [RaceType.BEAST, RaceType.ELEMENTAL],
        });
        
    }
}
