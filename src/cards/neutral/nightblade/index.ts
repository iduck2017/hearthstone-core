import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../rules/class";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { RarityType } from "../../../rules/rarity";
import { NightbladeBattlecryModel } from "./battlecry";

@useModel('nightblade-model')
export class NightbladeModel extends MinionModel {
    protected _brand: symbol = Symbol('nightblade-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 4 }),
                health: new RoleHealthModel({ origin: 4 }),
            }),
            cost: new CostModel({ origin: 5 }),
            rarity: RarityType.COMMON,
            races: [],
            feats: [new NightbladeBattlecryModel()],
        });

    }
}
