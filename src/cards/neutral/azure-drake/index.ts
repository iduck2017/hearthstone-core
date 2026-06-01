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
import { AzureDrakeBattlecryModel } from "./battlecry";

@useModel('azure-drake-model')
export class AzureDrakeModel extends MinionModel {
    protected _brand: symbol = Symbol('azure-drake-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 4 }),
                health: new RoleHealthModel({ origin: 4 }),
            }),
            cost: new CostModel({ origin: 5 }),
            rarity: RarityType.RARE,
            races: [RaceType.DRAGON],
            feats: [
                new AzureDrakeBattlecryModel(),
                new SpellDamageFeatModel(1),
            ],
        });
    }
}
