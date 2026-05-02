import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../utils/enums";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { EarthenRingFarseerBattlecryModel } from "./battlecry";
import { RarityType } from "../../../utils/enums";

@useModel('earthen-ring-farseer-model')
export class EarthenRingFarseerModel extends MinionModel {
    protected _brand: symbol = Symbol('earthen-ring-farseer-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 3 }),
                health: new RoleHealthModel({ origin: 3 }),
            }),
            cost: new CostModel({ origin: 3 }),
            rarity: RarityType.BASIC,
            races: [],
            feats: [new EarthenRingFarseerBattlecryModel()],
        });
        
    }
}
