import { useModel } from "set-piece";
import { RoleAttackModel } from "../../../rules/role-attack";
import { ClassType, RaceType, RarityType } from "../../../utils/enums";
import { CostModel } from "../../../rules/cost";
import { RoleHealthModel } from "../../../rules/role-health";
import { FrostElementalBattlecryModel } from "./battlecry";
import { MinionModel } from "../../minion";
import { RoleModel } from "../../../entities/role";

@useModel('frost-elemental-model')
export class FrostElementalModel extends MinionModel {
    protected _brand: symbol = Symbol('frost-elemental-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 5 }),
                health: new RoleHealthModel({ origin: 5 }),
            }),
            cost: new CostModel({ origin: 6 }),
            rarity: RarityType.COMMON,
            races: [RaceType.ELEMENTAL],
            feats: [
                new FrostElementalBattlecryModel(),
            ],
        });
    }
}
