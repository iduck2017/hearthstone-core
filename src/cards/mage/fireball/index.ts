import { useModel } from "set-piece";
import { SpellModel } from "../../spell";
import { CostModel } from "../../../rules/cost";
import { ClassType } from "../../../utils/enums";
import { RarityType } from "../../../utils/enums";
import { FireballEffectModel } from "./effect";

@useModel('fireball-model')
export class FireballModel extends SpellModel {
    protected _brand: symbol = Symbol('fireball-model');
    constructor() {
        super({
            cost: new CostModel({ origin: 4 }),
            class: ClassType.MAGE,
            rarity: RarityType.COMMON,
            feats: [new FireballEffectModel()],
        });
    }
}
