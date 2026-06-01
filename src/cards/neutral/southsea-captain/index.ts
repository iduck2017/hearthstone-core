import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../utils/enums";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { RaceType } from "../../../utils/enums";
import { RarityType } from "../../../utils/enums";
import { SouthseaCaptainFeatModel } from "./feat";

@useModel('southsea-captain-model')
export class SouthseaCaptainModel extends MinionModel {
    protected _brand: symbol = Symbol('southsea-captain-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 3 }),
                health: new RoleHealthModel({ origin: 3 }),
            }),
            cost: new CostModel({ origin: 3 }),
            rarity: RarityType.EPIC,
            races: [RaceType.PIRATE],
            feats: [new SouthseaCaptainFeatModel()],
        });

    }
}
