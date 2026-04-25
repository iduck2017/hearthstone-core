import { CostModel } from "../../../rules/cost";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../rules/class";
import { MinionModel } from "../../minion";
import { RarityType } from "../../../rules/rarity";
import { RoleModel } from "../../../entities/role";

export class WispModel extends MinionModel {
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
        this.init();
    }
}
