import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../rules/class";
import { StealthModel } from "../../../rules/stealth";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { RarityType } from "../../../rules/rarity";

@useModel('ravenholdt-assassin-model')
export class RavenholdtAssassinModel extends MinionModel {
    protected _brand: symbol = Symbol('ravenholdt-assassin-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 7 }),
                health: new RoleHealthModel({ origin: 5 }),
                stealth: new StealthModel({ isActived: true }),
            }),
            cost: new CostModel({ origin: 7 }),
            rarity: RarityType.RARE,
            races: [],
        });
        
    }
}
