import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../utils/enums";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { AmaniBerserkerFeatModel } from "./feat";
import { RarityType } from "../../../utils/enums";

@useModel('amani-berserker-model')
export class AmaniBerserkerModel extends MinionModel {
    protected _brand: symbol = Symbol('amani-berserker-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 2 }),
                health: new RoleHealthModel({ origin: 3 }),
            }),
            cost: new CostModel({ origin: 2 }),
            rarity: RarityType.BASIC,
            races: [],
            feats: [new AmaniBerserkerFeatModel()],
        });
        
    }
}
