import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../rules/class";
import { StealthModel } from "../../../rules/stealth";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { RaceType } from "../../../rules/race";
import { RarityType } from "../../../rules/rarity";

@useModel('jungle-panther-model')
export class JunglePantherModel extends MinionModel {
    protected _brand: symbol = Symbol('jungle-panther-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 4 }),
                health: new RoleHealthModel({ origin: 2 }),
                stealth: new StealthModel({ isActived: true }),
            }),
            cost: new CostModel({ origin: 3 }),
            rarity: RarityType.BASIC,
            races: [RaceType.BEAST],
        });
        
    }
}
