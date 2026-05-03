import { useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { RoleHealthBuffModel } from "../../../feats/role-health-buff";

@useModel('coldlight-seer-buff-model')
export class ColdlightSeerBuffModel extends FeatModel {
    protected _brand: symbol = Symbol('coldlight-seer-buff-model');

    constructor() {
        super({ subFeats: [new RoleHealthBuffModel(2)] });
    }
}
