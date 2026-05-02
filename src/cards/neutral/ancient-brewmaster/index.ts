import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleModel } from "../../../entities/role";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { ClassType, RarityType } from "../../../utils/enums";
import { AncientBrewmasterBattlecryModel } from "./battlecry";

@useModel('ancient-brewmaster-model')
export class AncientBrewmasterModel extends MinionModel {
    protected _brand: symbol = Symbol('ancient-brewmaster-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            rarity: RarityType.COMMON,
            races: [],
            cost: new CostModel({ origin: 5 }),
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 5 }),
                health: new RoleHealthModel({ origin: 4 }),
            }),
            feats: [
                new AncientBrewmasterBattlecryModel(),
            ],
        });
    }
}
