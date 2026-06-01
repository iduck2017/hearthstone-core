import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../utils/enums";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { StormpikeCommandoBattlecryModel } from "./battlecry";
import { RarityType } from "../../../utils/enums";

@useModel('stormpike-commando-model')
export class StormpikeCommandoModel extends MinionModel {
    protected _brand: symbol = Symbol('stormpike-commando-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 4 }),
                health: new RoleHealthModel({ origin: 2 }),
            }),
            cost: new CostModel({ origin: 5 }),
            rarity: RarityType.COMMON,
            races: [],
            feats: [
                new StormpikeCommandoBattlecryModel(),
            ],
        });
        
    }
}
