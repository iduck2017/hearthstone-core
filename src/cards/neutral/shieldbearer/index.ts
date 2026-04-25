import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../rules/class";
import { TauntModel } from "../../../rules/taunt";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { RarityType } from "../../../rules/rarity";

export class ShieldbearerModel extends MinionModel {
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 0 }),
                health: new RoleHealthModel({ origin: 4 }),
                taunt: new TauntModel({ isActived: true }),
            }),
            cost: new CostModel({ origin: 1 }),
            rarity: RarityType.BASIC,
            races: [],
        });
        this.init();
    }
}
