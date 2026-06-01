import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../utils/enums";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { AcolyteOfPainFeatModel } from "./feat";
import { RarityType } from "../../../utils/enums";

@useModel('acolyte-of-pain-model')
export class AcolyteOfPainModel extends MinionModel {
    protected _brand: symbol = Symbol('acolyte-of-pain-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 1 }),
                health: new RoleHealthModel({ origin: 3 }),
            }),
            cost: new CostModel({ origin: 3 }),
            rarity: RarityType.BASIC,
            races: [],
            feats: [new AcolyteOfPainFeatModel()],
        });
        
    }
}
