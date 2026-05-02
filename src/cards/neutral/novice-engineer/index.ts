import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../utils/enums";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { NoviceEngineerBattlecryModel } from "./battlecry";
import { RarityType } from "../../../utils/enums";

@useModel('novice-engineer-model')
export class NoviceEngineerModel extends MinionModel {
    protected _brand: symbol = Symbol('novice-engineer-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 1 }),
                health: new RoleHealthModel({ origin: 1 }),
            }),
            cost: new CostModel({ origin: 2 }),
            rarity: RarityType.COMMON,
            races: [],
            feats: [
                new NoviceEngineerBattlecryModel(),
            ],
        });
        
    }
}
