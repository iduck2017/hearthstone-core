import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleModel } from "../../../entities/role";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { ClassType, RarityType, RaceType } from "../../../utils/enums";
import { IronbeakOwlBattlecryModel } from "./battlecry";

@useModel('ironbeak-owl-model')
export class IronbeakOwlModel extends MinionModel {
    protected _brand: symbol = Symbol('ironbeak-owl-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            rarity: RarityType.COMMON,
            races: [RaceType.BEAST],
            cost: new CostModel({ origin: 3 }),
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 2 }),
                health: new RoleHealthModel({ origin: 1 }),
            }),
            feats: [
                new IronbeakOwlBattlecryModel(),
            ],
        });
    }
}
