import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleModel } from "../../../entities/role";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { ClassType, RarityType, RaceType } from "../../../utils/enums";
import { OnyxiaBattlecryModel } from "./battlecry";

@useModel('onyxia-model')
export class OnyxiaModel extends MinionModel {
    protected _brand: symbol = Symbol('onyxia-model');

    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 8 }),
                health: new RoleHealthModel({ origin: 8 }),
            }),
            cost: new CostModel({ origin: 9 }),
            rarity: RarityType.LEGENDARY,
            races: [RaceType.DRAGON],
            feats: [new OnyxiaBattlecryModel()],
        });
    }
}
