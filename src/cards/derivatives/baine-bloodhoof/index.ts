import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../rules/class";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { RarityType } from "../../../rules/rarity";

@useModel('baine-bloodhoof-model')
export class BaineBloodhoofModel extends MinionModel {
    protected _brand: symbol = Symbol('baine-bloodhoof-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 5 }),
                health: new RoleHealthModel({ origin: 5 }),
            }),
            cost: new CostModel({ origin: 0 }),
            rarity: RarityType.BASIC,
            races: [],
        });
        
    }
}
