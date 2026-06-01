import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleModel } from "../../../entities/role";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { ClassType, RaceType, RarityType } from "../../../utils/enums";
import { MurlocTidecallerFeatModel } from "./feat";

@useModel('murloc-tidecaller-model')
export class MurlocTidecallerModel extends MinionModel {
    protected _brand: symbol = Symbol('murloc-tidecaller-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 1 }),
                health: new RoleHealthModel({ origin: 2 }),
            }),
            cost: new CostModel({ origin: 1 }),
            rarity: RarityType.COMMON,
            races: [RaceType.MURLOC],
            feats: [new MurlocTidecallerFeatModel()],
        });
    }
}
