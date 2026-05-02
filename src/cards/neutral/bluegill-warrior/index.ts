import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../utils/enums";
import { ChargeModel } from "../../../rules/charge";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { RaceType } from "../../../utils/enums";
import { RarityType } from "../../../utils/enums";

@useModel('bluegill-warrior-model')
export class BluegillWarriorModel extends MinionModel {
    protected _brand: symbol = Symbol('bluegill-warrior-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 2 }),
                health: new RoleHealthModel({ origin: 1 }),
                charge: new ChargeModel({ isActived: true }),
            }),
            cost: new CostModel({ origin: 2 }),
            rarity: RarityType.COMMON,
            races: [RaceType.MURLOC],
        });
        
    }
}
