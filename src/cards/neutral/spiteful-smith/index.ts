import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleModel } from "../../../entities/role";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { ClassType, RarityType } from "../../../utils/enums";
import { SpitefulSmithFeatModel } from "./feat";

@useModel('spiteful-smith-model')
export class SpitefulSmithModel extends MinionModel {
    protected _brand: symbol = Symbol('spiteful-smith-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 4 }),
                health: new RoleHealthModel({ origin: 6 }),
            }),
            cost: new CostModel({ origin: 5 }),
            rarity: RarityType.COMMON,
            races: [],
            feats: [new SpitefulSmithFeatModel()],
        });
    }
}
