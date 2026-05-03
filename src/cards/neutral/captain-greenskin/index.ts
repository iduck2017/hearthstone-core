import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleModel } from "../../../entities/role";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { ClassType, RaceType, RarityType } from "../../../utils/enums";
import { CaptainGreenskinBattlecryModel } from "./battlecry";

@useModel('captain-greenskin-model')
export class CaptainGreenskinModel extends MinionModel {
    protected _brand: symbol = Symbol('captain-greenskin-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 5 }),
                health: new RoleHealthModel({ origin: 4 }),
            }),
            cost: new CostModel({ origin: 5 }),
            rarity: RarityType.LEGENDARY,
            races: [RaceType.PIRATE],
            feats: [new CaptainGreenskinBattlecryModel()],
        });
    }
}
