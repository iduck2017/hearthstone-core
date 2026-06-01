import { useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { RoleAttackBuffModel } from "../../../feats/role-attack-buff";
import { RoleHealthBuffModel } from "../../../feats/role-health-buff";

/** Permanent +n/+n buff applied by Frostwolf Warlord's battlecry. */
@useModel('frostwolf-warlord-buff-model')
export class FrostwolfWarlordBuffModel extends FeatModel {
    protected _brand: symbol = Symbol('frostwolf-warlord-buff-model');

    constructor(value: number) {
        super({ subFeats: [new RoleAttackBuffModel(value), new RoleHealthBuffModel(value)] });
    }
}
