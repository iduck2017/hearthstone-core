import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { StealthModel } from "../../../rules/stealth";
import { ClassType } from "../../../rules/class";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { RaceType } from "../../../rules/race";
import { RarityType } from "../../../rules/rarity";

@useModel('stranglethorn-tiger-model')
export class StranglethornTigerModel extends MinionModel {
    protected _brand: symbol = Symbol('stranglethorn-tiger-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 5 }),
                health: new RoleHealthModel({ origin: 5 }),
                stealth: new StealthModel({ isActived: true }),
            }),
            cost: new CostModel({ origin: 5 }),
            rarity: RarityType.BASIC,
            races: [RaceType.BEAST],
        });
        
    }
}
