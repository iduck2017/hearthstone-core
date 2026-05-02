import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleModel } from "../../../entities/role";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { ClassType, RarityType } from "../../../utils/enums";
import { SpellbreakerBattlecryModel } from "./battlecry";

@useModel('spellbreaker-model')
export class SpellbreakerModel extends MinionModel {
    protected _brand: symbol = Symbol('spellbreaker-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            rarity: RarityType.COMMON,
            races: [],
            cost: new CostModel({ origin: 4 }),
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 4 }),
                health: new RoleHealthModel({ origin: 3 }),
            }),
            feats: [
                new SpellbreakerBattlecryModel(),
            ],
        });
    }
}
