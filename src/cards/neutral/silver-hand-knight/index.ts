import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../utils/enums";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { SilverHandKnightBattlecryModel } from "./battlecry";
import { RarityType } from "../../../utils/enums";

@useModel('silver-hand-knight-model')
export class SilverHandKnightModel extends MinionModel {
    protected _brand: symbol = Symbol('silver-hand-knight-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 4 }),
                health: new RoleHealthModel({ origin: 4 }),
            }),
            cost: new CostModel({ origin: 5 }),
            rarity: RarityType.BASIC,
            races: [],
            feats: [
                new SilverHandKnightBattlecryModel(),
            ],
        });
        
    }
}
