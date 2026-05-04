import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../utils/enums";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { RarityType } from "../../../utils/enums";
import { GruulFeatModel } from "./feat";

@useModel('gruul-model')
export class GruulModel extends MinionModel {
    protected _brand: symbol = Symbol('gruul-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 7 }),
                health: new RoleHealthModel({ origin: 7 }),
            }),
            cost: new CostModel({ origin: 8 }),
            rarity: RarityType.LEGENDARY,
            races: [],
            feats: [
                new GruulFeatModel(),
            ],
        });
    }
}
