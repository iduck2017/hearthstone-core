import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../rules/class";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { DarkIronDwarfBattlecryModel } from "./battlecry";
import { RarityType } from "../../../rules/rarity";

@useModel('dark-iron-dwarf-model')
export class DarkIronDwarfModel extends MinionModel {
    protected _brand: symbol = Symbol('dark-iron-dwarf-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 4 }),
                health: new RoleHealthModel({ origin: 4 }),
            }),
            cost: new CostModel({ origin: 4 }),
            rarity: RarityType.BASIC,
            races: [],
            feats: [
                new DarkIronDwarfBattlecryModel(),
            ],
        });
        
    }
}
