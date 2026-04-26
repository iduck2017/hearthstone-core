import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../rules/class";
import { TauntModel } from "../../../rules/taunt";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { RarityType } from "../../../rules/rarity";

@useModel('lord-of-the-arena-model')
export class LordOfTheArenaModel extends MinionModel {
    protected _brand: symbol = Symbol('lord-of-the-arena-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 6 }),
                health: new RoleHealthModel({ origin: 5 }),
                taunt: new TauntModel({ isActived: true }),
            }),
            cost: new CostModel({ origin: 6 }),
            rarity: RarityType.COMMON,
            races: [],
        });
        
    }
}
