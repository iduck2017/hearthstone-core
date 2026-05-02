import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../utils/enums";
import { TauntModel } from "../../../rules/taunt";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { RarityType } from "../../../utils/enums";

@useModel('booty-bay-bodyguard-model')
export class BootyBayBodyguardModel extends MinionModel {
    protected _brand: symbol = Symbol('booty-bay-bodyguard-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 5 }),
                health: new RoleHealthModel({ origin: 4 }),
                taunt: new TauntModel({ isActived: true }),
            }),
            cost: new CostModel({ origin: 5 }),
            rarity: RarityType.COMMON,
            races: [],
        });
        
    }
}
