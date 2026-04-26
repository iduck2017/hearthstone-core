import { useModel } from "set-piece";
import { RoleAttackModel } from "../../../rules/role-attack";
import { ClassType } from "../../../rules/class";
import { CostModel } from "../../../rules/cost";
import { RoleHealthModel } from "../../../rules/role-health";
import { ElvenArcherBattlecryModel } from "./battlecry";
import { MinionModel } from "../../minion";
import { RoleModel } from "../../../entities/role";
import { RarityType } from "../../../rules/rarity";

@useModel('elven-archer-model')
export class ElvenArcherModel extends MinionModel {
    protected _brand: symbol = Symbol('elven-archer-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 1 }),
                health: new RoleHealthModel({ origin: 1 }),
            }),
            cost: new CostModel({ origin: 1 }),
            rarity: RarityType.COMMON,
            races: [],
            feats: [
                new ElvenArcherBattlecryModel(),
            ],
        });
        
    }
}
