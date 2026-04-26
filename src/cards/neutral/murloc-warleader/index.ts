import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../rules/class";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { RaceType } from "../../../rules/race";
import { RarityType } from "../../../rules/rarity";
import { MurlocWarleaderFeatModel } from "./feat";

@useModel('murloc-warleader-model')
export class MurlocWarleaderModel extends MinionModel {
    protected _brand: symbol = Symbol('murloc-warleader-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 3 }),
                health: new RoleHealthModel({ origin: 3 }),
            }),
            cost: new CostModel({ origin: 3 }),
            rarity: RarityType.EPIC,
            races: [RaceType.MURLOC],
            feats: [new MurlocWarleaderFeatModel()],
        });

    }
}
