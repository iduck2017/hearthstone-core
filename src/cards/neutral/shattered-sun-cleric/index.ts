import { useModel } from "set-piece";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../utils/enums";
import { CostModel } from "../../../rules/cost";
import { ShatteredSunClericBattlecryModel } from "./battlecry";
import { MinionModel } from "../../minion";
import { RoleModel } from "../../../entities/role";
import { RarityType } from "../../../utils/enums";

@useModel('shattered-sun-cleric-model')
export class ShatteredSunClericModel extends MinionModel {
    protected _brand: symbol = Symbol('shattered-sun-cleric-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 3 }),
                health: new RoleHealthModel({ origin: 2 }),
            }),
            cost: new CostModel({ origin: 3 }),
            rarity: RarityType.COMMON,
            races: [],
            feats: [
                new ShatteredSunClericBattlecryModel(),
            ],
        });
        
    }
}
