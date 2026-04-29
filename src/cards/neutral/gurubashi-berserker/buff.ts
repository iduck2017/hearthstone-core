import { useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { RoleAttackBuffModel } from "../../../feats/role-attack-buff";

const ENRAGE_ATTACK = 3;

@useModel('gurubashi-berserker-buff-model')
export class GurubashiBerserkerBuffModel extends FeatModel {
    protected _brand: symbol = Symbol('gurubashi-berserker-buff-model');

    constructor() {
        super({ subFeats: [new RoleAttackBuffModel(ENRAGE_ATTACK)] });
    }
}
