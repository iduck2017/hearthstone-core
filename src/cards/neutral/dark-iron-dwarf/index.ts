import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../rules/class";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { DarkIronDwarfBattlecryModel } from "./battlecry";
import { RarityType } from "../../../rules/rarity";

export class DarkIronDwarfModel extends MinionModel {
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 4 }),
                health: new RoleHealthModel({ origin: 4 }),
            }),
            cost: new CostModel({ origin: 4 }),
            rarity: RarityType.BASIC,
            races: [],
            feats: [
                new DarkIronDwarfBattlecryModel(),
            ],
        });
        this.init();
    }
}
