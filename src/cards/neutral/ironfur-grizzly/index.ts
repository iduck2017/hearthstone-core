import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../rules/class";
import { TauntModel } from "../../../rules/taunt";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { RaceType } from "../../../rules/race";
import { RarityType } from "../../../rules/rarity";

@useModel('ironfur-grizzly-model')
export class IronfurGrizzlyModel extends MinionModel {
    protected _brand: symbol = Symbol('ironfur-grizzly-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 3 }),
                health: new RoleHealthModel({ origin: 3 }),
                taunt: new TauntModel({ isActived: true }),
            }),
            cost: new CostModel({ origin: 3 }),
            rarity: RarityType.COMMON,
            races: [RaceType.BEAST],
        });
        
    }
}
