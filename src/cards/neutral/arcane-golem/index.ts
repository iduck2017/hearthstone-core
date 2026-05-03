import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleModel } from "../../../entities/role";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { ClassType, RarityType } from "../../../utils/enums";
import { ChargeModel } from "../../../rules/charge";
import { ArcaneGolemBattlecryModel } from "./battlecry";

@useModel('arcane-golem-model')
export class ArcaneGolemModel extends MinionModel {
    protected _brand: symbol = Symbol('arcane-golem-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 4 }),
                health: new RoleHealthModel({ origin: 2 }),
                charge: new ChargeModel({ isActived: true }),
            }),
            cost: new CostModel({ origin: 3 }),
            rarity: RarityType.RARE,
            races: [],
            feats: [new ArcaneGolemBattlecryModel()],
        });
    }
}
