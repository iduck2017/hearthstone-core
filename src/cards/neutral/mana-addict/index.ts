import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleModel } from "../../../entities/role";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { ClassType } from "../../../rules/class";
import { RarityType } from "../../../rules/rarity";
import { ManaAddictFeatModel } from "./feat";

@useModel('mana-addict-model')
export class ManaAddictModel extends MinionModel {
    protected _brand: symbol = Symbol('mana-addict-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 1 }),
                health: new RoleHealthModel({ origin: 3 }),
            }),
            cost: new CostModel({ origin: 2 }),
            rarity: RarityType.RARE,
            races: [],
            feats: [new ManaAddictFeatModel()],
        });
    }
}
