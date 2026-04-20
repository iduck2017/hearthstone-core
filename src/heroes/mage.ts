import { HeroModel } from ".";
import { RoleAttackModel } from "../rules/role-attack";
import { RoleHealthModel } from "../rules/role-health";

export class MageModel extends HeroModel {
    constructor() {
        super({
            attack: new RoleAttackModel({ origin: 1 }),
            health: new RoleHealthModel({ origin: 30 }),
        });
        this.init()
    }
}