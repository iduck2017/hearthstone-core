import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../rules/class";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { InjuredBlademasterBattlecryModel } from "./battlecry";
import { RarityType } from "../../../rules/rarity";

@useModel('injured-blademaster-model')
export class InjuredBlademasterModel extends MinionModel {
    protected _brand: symbol = Symbol('injured-blademaster-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 4 }),
                health: new RoleHealthModel({ origin: 7 }),
            }),
            cost: new CostModel({ origin: 3 }),
            rarity: RarityType.RARE,
            races: [],
            feats: [new InjuredBlademasterBattlecryModel()],
        });
        
    }
}
