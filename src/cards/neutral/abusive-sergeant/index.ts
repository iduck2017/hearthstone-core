import { useModel } from "set-piece";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../utils/enums";
import { CostModel } from "../../../rules/cost";
import { AbusiveSergeantBattlecryModel } from "./battlecry";
import { MinionModel } from "../../minion";
import { RarityType } from "../../../utils/enums";
import { RoleModel } from "../../../entities/role";

@useModel('abusive-sergeant-model')
export class AbusiveSergeantModel extends MinionModel {
    protected _brand: symbol = Symbol('abusive-sergeant-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 2 }),
                health: new RoleHealthModel({ origin: 1 }),
            }),
            cost: new CostModel({ origin: 1 }),
            rarity: RarityType.BASIC,
            races: [],
            feats: [
                new AbusiveSergeantBattlecryModel(),
            ],
        });
        
    }
}
