import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleModel } from "../../../entities/role";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { ClassType, RarityType } from "../../../utils/enums";
import { BaronGeddonFeatModel } from "./feat";

@useModel('baron-geddon-model')
export class BaronGeddonModel extends MinionModel {
    protected _brand: symbol = Symbol('baron-geddon-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 7 }),
                health: new RoleHealthModel({ origin: 7 }),
            }),
            cost: new CostModel({ origin: 7 }),
            rarity: RarityType.LEGENDARY,
            races: [],
            feats: [new BaronGeddonFeatModel()],
        });
    }
}
