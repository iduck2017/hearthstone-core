import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleModel } from "../../../entities/role";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { ClassType, RarityType } from "../../../utils/enums";
import { SeaGiantFeatModel } from "./feat";

@useModel('sea-giant-model')
export class SeaGiantModel extends MinionModel {
    protected _brand: symbol = Symbol('sea-giant-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 8 }),
                health: new RoleHealthModel({ origin: 8 }),
            }),
            cost: new CostModel({ origin: 10 }),
            rarity: RarityType.EPIC,
            races: [],
            feats: [new SeaGiantFeatModel()],
        });
    }
}
