import { useModel } from "set-piece";
import { HeroModel } from ".";
import { RoleAttackModel } from "../rules/role-attack";
import { RoleHealthModel } from "../rules/role-health";

@useModel('warrior-model')
export class WarriorModel extends HeroModel {
    protected _brand: symbol = Symbol('warrior-model');
    constructor() {
        super({
            attack: new RoleAttackModel({ origin: 0 }),
            health: new RoleHealthModel({ origin: 30 }),
        });
    }
}
