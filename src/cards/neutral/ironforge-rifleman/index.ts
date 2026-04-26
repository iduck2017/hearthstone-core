import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../rules/class";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { IronforgeRiflemanBattlecryModel } from "./battlecry";
import { RarityType } from "../../../rules/rarity";

@useModel('ironforge-rifleman-model')
export class IronforgeRiflemanModel extends MinionModel {
    protected _brand: symbol = Symbol('ironforge-rifleman-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 2 }),
                health: new RoleHealthModel({ origin: 2 }),
            }),
            cost: new CostModel({ origin: 3 }),
            rarity: RarityType.COMMON,
            races: [],
            feats: [
                new IronforgeRiflemanBattlecryModel(),
            ],
        });
        
    }
}
