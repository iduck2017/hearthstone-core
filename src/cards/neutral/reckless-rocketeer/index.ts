import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../rules/class";
import { ChargeModel } from "../../../rules/charge";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { RarityType } from "../../../rules/rarity";

@useModel('reckless-rocketeer-model')
export class RecklessRocketeerModel extends MinionModel {
    protected _brand: symbol = Symbol('reckless-rocketeer-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 5 }),
                health: new RoleHealthModel({ origin: 2 }),
                charge: new ChargeModel({ isActived: true }),
            }),
            cost: new CostModel({ origin: 6 }),
            rarity: RarityType.COMMON,
            races: [],
        });
        
    }
}
