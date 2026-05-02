import { useModel } from "set-piece";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../utils/enums";
import { ChargeModel } from "../../../rules/charge";
import { CostModel } from "../../../rules/cost";
import { MinionModel } from "../../minion";
import { RoleModel } from "../../../entities/role";
import { RaceType } from "../../../utils/enums";
import { RarityType } from "../../../utils/enums";

@useModel('stonetusk-boar-model')
export class StonetuskBoarModel extends MinionModel {
    protected _brand: symbol = Symbol('stonetusk-boar-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 1 }),
                health: new RoleHealthModel({ origin: 1 }),
                charge: new ChargeModel({ isActived: true }),
            }),
            cost: new CostModel({ origin: 1 }),
            rarity: RarityType.COMMON,
            races: [RaceType.BEAST],
        });
        
    }
}
