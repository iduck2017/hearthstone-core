import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleModel } from "../../../entities/role";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { ClassType, RarityType } from "../../../utils/enums";
import { YouthfulBrewmasterBattlecryModel } from "./battlecry";

@useModel('youthful-brewmaster-model')
export class YouthfulBrewmasterModel extends MinionModel {
    protected _brand: symbol = Symbol('youthful-brewmaster-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            rarity: RarityType.COMMON,
            races: [],
            cost: new CostModel({ origin: 2 }),
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 3 }),
                health: new RoleHealthModel({ origin: 2 }),
            }),
            feats: [
                new YouthfulBrewmasterBattlecryModel(),
            ],
        });
    }
}
