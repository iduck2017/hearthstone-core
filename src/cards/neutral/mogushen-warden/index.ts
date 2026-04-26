import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../rules/class";
import { TauntModel } from "../../../rules/taunt";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { RarityType } from "../../../rules/rarity";

@useModel('mogushen-warden-model')
export class MogushenWardenModel extends MinionModel {
    protected _brand: symbol = Symbol('mogushen-warden-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 1 }),
                health: new RoleHealthModel({ origin: 7 }),
                taunt: new TauntModel({ isActived: true }),
            }),
            cost: new CostModel({ origin: 4 }),
            rarity: RarityType.COMMON,
            races: [],
        });
        
    }
}
