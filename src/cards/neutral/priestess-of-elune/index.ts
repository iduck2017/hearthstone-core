import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../utils/enums";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { PriestessOfEluneBattlecryModel } from "./battlecry";
import { RarityType } from "../../../utils/enums";

@useModel('priestess-of-elune-model')
export class PriestessOfEluneModel extends MinionModel {
    protected _brand: symbol = Symbol('priestess-of-elune-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 5 }),
                health: new RoleHealthModel({ origin: 4 }),
            }),
            cost: new CostModel({ origin: 6 }),
            rarity: RarityType.BASIC,
            races: [],
            feats: [new PriestessOfEluneBattlecryModel()],
        });
        
    }
}
