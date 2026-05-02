import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../utils/enums";
import { DivineShieldModel } from "../../../rules/divine-shield";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { RarityType } from "../../../utils/enums";

@useModel('argent-squire-model')
export class ArgentSquireModel extends MinionModel {
    protected _brand: symbol = Symbol('argent-squire-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 1 }),
                health: new RoleHealthModel({ origin: 1 }),
                divineShield: new DivineShieldModel({ isActived: true }),
            }),
            cost: new CostModel({ origin: 1 }),
            rarity: RarityType.BASIC,
            races: [],
        });
        
    }
}
