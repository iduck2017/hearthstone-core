import { useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { RoleAttackBuffModel } from "../../../feats/role-attack-buff";

@useModel('flesheating-ghoul-buff-model')
export class FlesheatingGhoulBuffModel extends FeatModel {
    protected _brand: symbol = Symbol('flesheating-ghoul-buff-model');

    constructor() {
        super({ subFeats: [new RoleAttackBuffModel(1)] });
    }
}
