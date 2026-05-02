import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleHealthModel } from "../../../rules/role-health";
import { RoleAttackModel } from "../../../rules/role-attack";
import { ClassType } from "../../../utils/enums";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { LeperGnomeDeathrattleModel } from "./deathrattle";
import { RarityType } from "../../../utils/enums";

@useModel('leper-gnome-model')
export class LeperGnomeModel extends MinionModel {
    protected _brand: symbol = Symbol('leper-gnome-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 2 }),
                health: new RoleHealthModel({ origin: 1 }),
            }),
            cost: new CostModel({ origin: 1 }),
            rarity: RarityType.BASIC,
            races: [],
            feats: [
                new LeperGnomeDeathrattleModel(),
            ],
        });
        
    }
}
