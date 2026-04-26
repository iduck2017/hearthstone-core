import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../rules/class";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { DragonlingMechanicBattlecryModel } from "./battlecry";
import { RarityType } from "../../../rules/rarity";

@useModel('dragonling-mechanic-model')
export class DragonlingMechanicModel extends MinionModel {
    protected _brand: symbol = Symbol('dragonling-mechanic-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 2 }),
                health: new RoleHealthModel({ origin: 4 }),
            }),
            cost: new CostModel({ origin: 4 }),
            rarity: RarityType.COMMON,
            races: [],
            feats: [
                new DragonlingMechanicBattlecryModel(),
            ],
        });
        
    }
}
