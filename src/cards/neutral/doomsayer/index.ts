import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleModel } from "../../../entities/role";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { ClassType, RarityType } from "../../../utils/enums";
import { DoomsayerFeatModel } from "./feat";

@useModel('doomsayer-model')
export class DoomsayerModel extends MinionModel {
    protected _brand: symbol = Symbol('doomsayer-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 0 }),
                health: new RoleHealthModel({ origin: 7 }),
            }),
            cost: new CostModel({ origin: 2 }),
            rarity: RarityType.RARE,
            races: [],
            feats: [new DoomsayerFeatModel()],
        });
    }
}
