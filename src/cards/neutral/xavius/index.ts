import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../utils/enums";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { RarityType } from "../../../utils/enums";
import { RaceType } from "../../../utils/enums";
import { XaviusFeatModel } from "./feat";

@useModel('xavius-model')
export class XaviusModel extends MinionModel {
    protected _brand: symbol = Symbol('xavius-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 7 }),
                health: new RoleHealthModel({ origin: 5 }),
            }),
            cost: new CostModel({ origin: 6 }),
            rarity: RarityType.LEGENDARY,
            races: [RaceType.DEMON],
            feats: [
                new XaviusFeatModel(),
            ],
        });
    }
}
