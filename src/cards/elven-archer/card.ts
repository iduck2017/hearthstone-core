import { AttackModel } from "../../rules/attack";
import { CostModel } from "../../rules/cost";
import { HealthModel } from "../../rules/health";
import { MinionModel } from "../../entities/minion";
import { ElvenArcherBattlecryModel } from "./battlecry";

export class ElvenArcherModel extends MinionModel {
    constructor() {
        super({
            attack: new AttackModel({ origin: 1 }),
            health: new HealthModel({ origin: 1 }), 
            cost: new CostModel({ origin: 1 }),
            battlecries: [
                new ElvenArcherBattlecryModel(),
            ],
        })
    }
}