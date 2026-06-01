import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../utils/enums";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { RarityType } from "../../../utils/enums";
import { RaceType } from "../../../utils/enums";
import { SpellDamageFeatModel } from "../../../feats/spell-damage-feat";

@useModel('malygos-model')
export class MalygosModel extends MinionModel {
    protected _brand: symbol = Symbol('malygos-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 4 }),
                health: new RoleHealthModel({ origin: 12 }),
            }),
            cost: new CostModel({ origin: 9 }),
            rarity: RarityType.LEGENDARY,
            races: [RaceType.DRAGON],
            feats: [new SpellDamageFeatModel(5)],
        });
    }
}
