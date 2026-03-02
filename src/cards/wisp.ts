import { AttackModel } from "../rules/attack";
import { HealthModel } from "../rules/health";
import { MinionModel } from "../entities/minion";
import { CostModel } from "../rules/cost";

export class WispModel extends MinionModel {
    constructor() {
        super({
            attack: new AttackModel({
                origin: 1,
            }),
            health: new HealthModel({
                origin: 1,
            }), 
            cost: new CostModel({
                origin: 1,
            }),
        })
    }   
}