import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../rules/class";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { AntiqueHealbotBattlecryModel } from "./battlecry";
import { RaceType } from "../../../rules/race";
import { RarityType } from "../../../rules/rarity";

export class AntiqueHealbotModel extends MinionModel {
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 3 }),
                health: new RoleHealthModel({ origin: 3 }),
            }),
            cost: new CostModel({ origin: 5 }),
            rarity: RarityType.COMMON,
            races: [RaceType.MECH],
            feats: [new AntiqueHealbotBattlecryModel()],
        });
        this.init();
    }
}
