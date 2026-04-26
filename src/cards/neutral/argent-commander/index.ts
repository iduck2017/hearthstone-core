import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ChargeModel } from "../../../rules/charge";
import { ClassType } from "../../../rules/class";
import { DivineShieldModel } from "../../../rules/divine-shield";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { RarityType } from "../../../rules/rarity";

@useModel('argent-commander-model')
export class ArgentCommanderModel extends MinionModel {
    protected _brand: symbol = Symbol('argent-commander-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 4 }),
                health: new RoleHealthModel({ origin: 2 }),
                charge: new ChargeModel({ isActived: true }),
                divineShield: new DivineShieldModel({ isActived: true }),
            }),
            cost: new CostModel({ origin: 6 }),
            rarity: RarityType.RARE,
            races: [],
        });
        
    }
}
