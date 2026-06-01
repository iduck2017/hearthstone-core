import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType, RaceType, RarityType } from "../../../utils/enums";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { CaptainsParrotBattlecryModel } from "./battlecry";

@useModel('captains-parrot-model')
export class CaptainsParrotModel extends MinionModel {
    protected _brand: symbol = Symbol('captains-parrot-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 1 }),
                health: new RoleHealthModel({ origin: 1 }),
            }),
            cost: new CostModel({ origin: 2 }),
            rarity: RarityType.RARE,
            races: [RaceType.BEAST],
            feats: [
                new CaptainsParrotBattlecryModel(),
            ],
        });
    }
}
