import { useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { RoleAttackBuffModel } from "../../../feats/role-attack-buff";

@useModel('master-swordsmith-buff-model')
export class MasterSmithBuffModel extends FeatModel {
    protected _brand: symbol = Symbol('master-swordsmith-buff-model');

    constructor() {
        super({ subFeats: [new RoleAttackBuffModel(1)] });
    }
}
