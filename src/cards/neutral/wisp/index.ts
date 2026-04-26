import { useModel } from "set-piece";
import { CostModel } from "../../../rules/cost";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../rules/class";
import { MinionModel } from "../../minion";
import { RarityType } from "../../../rules/rarity";
import { RoleModel } from "../../../entities/role";

@useModel('wisp-model')
export class WispModel extends MinionModel {
    protected _brand: symbol = Symbol('wisp-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 1 }),
                health: new RoleHealthModel({ origin: 1 }),
            }),
            cost: new CostModel({ origin: 0 }),
            rarity: RarityType.BASIC,
            races: [],
        });
        
    }
}
