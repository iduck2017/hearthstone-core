import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../utils/enums";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { VoodooDoctorBattlecryModel } from "./battlecry";
import { RarityType } from "../../../utils/enums";

@useModel('voodoo-doctor-model')
export class VoodooDoctorModel extends MinionModel {
    protected _brand: symbol = Symbol('voodoo-doctor-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 2 }),
                health: new RoleHealthModel({ origin: 1 }),
            }),
            cost: new CostModel({ origin: 1 }),
            rarity: RarityType.COMMON,
            races: [],
            feats: [new VoodooDoctorBattlecryModel()],
        });
        
    }
}
