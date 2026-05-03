import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../utils/enums";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { RarityType } from "../../../utils/enums";
import { SpellDamageFeatModel } from "../../../feats/spell-damage-feat";

@useModel('archmage-model')
export class ArchmageModel extends MinionModel {
    protected _brand: symbol = Symbol('archmage-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 4 }),
                health: new RoleHealthModel({ origin: 7 }),
            }),
            cost: new CostModel({ origin: 6 }),
            rarity: RarityType.RARE,
            races: [],
            feats: [new SpellDamageFeatModel(1)],
        });
    }
}
