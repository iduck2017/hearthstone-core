import { useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { RoleAttackBuffModel } from "../../../feats/role-attack-buff";
import { RoleHealthBuffModel } from "../../../feats/role-health-buff";

@useModel('hungry-crab-buff-model')
export class HungryCrabBuffModel extends FeatModel {
    protected _brand: symbol = Symbol('hungry-crab-buff-model');

    constructor() {
        super({
            subFeats: [
                new RoleAttackBuffModel(2),
                new RoleHealthBuffModel(2),
            ],
        });
    }
}
