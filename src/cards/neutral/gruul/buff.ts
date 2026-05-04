import { useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { RoleAttackBuffModel } from "../../../feats/role-attack-buff";
import { RoleHealthBuffModel } from "../../../feats/role-health-buff";

@useModel('gruul-buff-model')
export class GruulBuffModel extends FeatModel {
    protected _brand: symbol = Symbol('gruul-buff-model');

    constructor() {
        super({ subFeats: [new RoleAttackBuffModel(1), new RoleHealthBuffModel(1)] });
    }
}
