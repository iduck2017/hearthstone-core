import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { ShatteredSunClericBattlecryModel } from "./battlecry";
import { MinionModel } from "../../minion";
import { RoleModel } from "../../../entities/role";

export class ShatteredSunClericModel extends MinionModel {
    constructor() {
        super({
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 3 }),
                health: new RoleHealthModel({ origin: 2 }),
            }),
            cost: new CostModel({ origin: 3 }),
            feats: [
                new ShatteredSunClericBattlecryModel(),
            ],
        });
        this.init();
    }
}
