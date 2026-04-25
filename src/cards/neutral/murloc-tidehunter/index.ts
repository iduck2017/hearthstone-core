import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../rules/class";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { MurlocTidehunterBattlecryModel } from "./battlecry";
import { RaceType } from "../../../rules/race";
import { RarityType } from "../../../rules/rarity";

export class MurlocTidehunterModel extends MinionModel {
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 2 }),
                health: new RoleHealthModel({ origin: 1 }),
            }),
            cost: new CostModel({ origin: 2 }),
            rarity: RarityType.COMMON,
            races: [RaceType.MURLOC],
            feats: [
                new MurlocTidehunterBattlecryModel(),
            ],
        });
        this.init();
    }
}
