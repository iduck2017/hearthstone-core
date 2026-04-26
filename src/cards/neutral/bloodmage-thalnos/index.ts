import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../rules/class";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { RarityType } from "../../../rules/rarity";
import { SpellDamageFeatModel } from "../../../feats/spell-damage-feat";
import { BloodmageThalnosDeathrattleModel } from "./deathrattle";

@useModel('bloodmage-thalnos-model')
export class BloodmageThalnossModel extends MinionModel {
    protected _brand: symbol = Symbol('bloodmage-thalnos-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 1 }),
                health: new RoleHealthModel({ origin: 1 }),
            }),
            cost: new CostModel({ origin: 2 }),
            rarity: RarityType.LEGENDARY,
            races: [],
            feats: [
                new SpellDamageFeatModel(1),
                new BloodmageThalnosDeathrattleModel(),
            ],
        });

    }
}
