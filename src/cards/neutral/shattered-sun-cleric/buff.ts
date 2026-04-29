import { useMemo, useRoute, useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { RoleModel } from "../../../entities/role";
import { RoleAttackBuffModel } from "../../../feats/role-attack-buff";
import { RoleHealthBuffModel } from "../../../feats/role-health-buff";

@useModel('shattered-sun-cleric-buff-model')
export class ShatteredSunClericBuffModel extends FeatModel {
    protected _brand: symbol = Symbol('shattered-sun-cleric-buff-model');

    constructor() {
        super({ 
            subFeats: [
                new RoleAttackBuffModel(1), 
                new RoleHealthBuffModel(1)
            ] 
        });
    }
}
