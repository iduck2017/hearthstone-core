import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../rules/class";
import { TauntModel } from "../../../rules/taunt";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { TaurenWarriorFeatModel } from "./feat";
import { RarityType } from "../../../rules/rarity";

@useModel('tauren-warrior-model')
export class TaurenWarriorModel extends MinionModel {
    protected _brand: symbol = Symbol('tauren-warrior-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 2 }),
                health: new RoleHealthModel({ origin: 3 }),
                taunt: new TauntModel({ isActived: true }),
            }),
            cost: new CostModel({ origin: 3 }),
            rarity: RarityType.BASIC,
            races: [],
            feats: [new TaurenWarriorFeatModel()],
        });
        
    }
}
