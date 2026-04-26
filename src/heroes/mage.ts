import { useModel } from "set-piece";
import { HeroModel } from ".";
import { RoleAttackModel } from "../rules/role-attack";
import { RoleHealthModel } from "../rules/role-health";

@useModel('mage-model')
export class MageModel extends HeroModel {
    protected _brand: symbol = Symbol('mage-model');
    constructor() {
        super({
            attack: new RoleAttackModel({ origin: 1 }),
            health: new RoleHealthModel({ origin: 30 }),
        });
        
    }
}