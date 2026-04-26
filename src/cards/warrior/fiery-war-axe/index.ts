import { useModel } from "set-piece";
import { WeaponModel } from "../../weapon";
import { CostModel } from "../../../rules/cost";
import { ClassType } from "../../../rules/class";
import { RarityType } from "../../../rules/rarity";

@useModel('fiery-war-axe-model')
export class FieryWarAxeModel extends WeaponModel {
    protected _brand: symbol = Symbol('fiery-war-axe-model');
    constructor() {
        super({
            cost: new CostModel({ origin: 2 }),
            class: ClassType.WARRIOR,
            rarity: RarityType.RARE,
            attack: 3,
            durability: 2,
        });
    }
}
