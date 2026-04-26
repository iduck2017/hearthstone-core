import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../rules/class";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { RarityType } from "../../../rules/rarity";
import { SpellDamageFeatModel } from "../../../feats/spell-damage-feat";

@useModel('dalaran-mage-model')
export class DalaranMageModel extends MinionModel {
    protected _brand: symbol = Symbol('dalaran-mage-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 1 }),
                health: new RoleHealthModel({ origin: 4 }),
            }),
            cost: new CostModel({ origin: 3 }),
            rarity: RarityType.COMMON,
            races: [],
            feats: [new SpellDamageFeatModel(1)],
        });
    }
}
