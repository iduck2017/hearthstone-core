import { RoleAttackModel } from "../../../rules/role-attack";
import { CostModel } from "../../../rules/cost";
import { RoleHealthModel } from "../../../rules/role-health";
import { ElvenArcherBattlecryModel } from "./battlecry";
import { MinionModel } from "../../minion";
import { RoleModel } from "../../../entities/role";

export class ElvenArcherModel extends MinionModel {
    constructor() {
        super({
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 1 }),
                health: new RoleHealthModel({ origin: 1 }),
            }),
            cost: new CostModel({ origin: 1 }),
            features: [
                new ElvenArcherBattlecryModel(),
            ],
        })
    }
}