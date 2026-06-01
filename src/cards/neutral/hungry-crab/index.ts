import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { ClassType, RarityType, RaceType } from "../../../utils/enums";
import { RoleModel } from "../../../entities/role";
import { HungryCrabBattlecryModel } from "./battlecry";

@useModel('hungry-crab-model')
export class HungryCrabModel extends MinionModel {
    protected _brand: symbol = Symbol('hungry-crab-model');

    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 1 }),
                health: new RoleHealthModel({ origin: 2 }),
            }),
            cost: new CostModel({ origin: 1 }),
            rarity: RarityType.EPIC,
            races: [RaceType.MURLOC],
            feats: [new HungryCrabBattlecryModel()],
        });
    }
}
