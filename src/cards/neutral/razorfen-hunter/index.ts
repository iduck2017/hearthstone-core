import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../rules/class";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { RazorfenHunterBattlecryModel } from "./battlecry";
import { RarityType } from "../../../rules/rarity";

@useModel('razorfen-hunter-model')
export class RazorfenHunterModel extends MinionModel {
    protected _brand: symbol = Symbol('razorfen-hunter-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 2 }),
                health: new RoleHealthModel({ origin: 3 }),
            }),
            cost: new CostModel({ origin: 3 }),
            rarity: RarityType.COMMON,
            races: [],
            feats: [
                new RazorfenHunterBattlecryModel(),
            ],
        });
        
    }
}
