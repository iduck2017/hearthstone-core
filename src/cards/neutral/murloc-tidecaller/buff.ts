import { useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { RoleAttackBuffModel } from "../../../feats/role-attack-buff";

@useModel('murloc-tidecaller-buff-model')
export class MurlocTidecallerBuffModel extends FeatModel {
    protected _brand: symbol = Symbol('murloc-tidecaller-buff-model');

    constructor() {
        super({ subFeats: [new RoleAttackBuffModel(1)] });
    }
}
