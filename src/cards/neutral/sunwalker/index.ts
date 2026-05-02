import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../utils/enums";
import { DivineShieldModel } from "../../../rules/divine-shield";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { RarityType } from "../../../utils/enums";
import { TauntModel } from "../../../rules/taunt";

@useModel('sunwalker-model')
export class SunwalkerModel extends MinionModel {
    protected _brand: symbol = Symbol('sunwalker-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 4 }),
                health: new RoleHealthModel({ origin: 5 }),
                taunt: new TauntModel({ isActived: true }),
                divineShield: new DivineShieldModel({ isActived: true }),
            }),
            cost: new CostModel({ origin: 6 }),
            rarity: RarityType.RARE,
            races: [],
        });
        
    }
}
