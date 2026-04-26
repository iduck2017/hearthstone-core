import { useChild, useMemo, useRoute, useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { RoleModel } from "../../../entities/role";
import { RoleAttackBuffModel } from "../../../feats/role-attack-buff";
import { RoleHealthBuffModel } from "../../../feats/role-health-buff";

@useModel('shattered-sun-cleric-buff-model')
export class ShatteredSunClericBuffModel extends FeatModel {
    protected _brand: symbol = Symbol('shattered-sun-cleric-buff-model');
    @useRoute(() => RoleModel)
    private _role?: RoleModel;
    @useMemo()
    public get role() {
        return this._role;
    }

    @useChild()
    public attackBuff: RoleAttackBuffModel;

    @useChild()
    public healthBuff: RoleHealthBuffModel;

    constructor() {
        super();
        this.attackBuff = new RoleAttackBuffModel(1);
        this.healthBuff = new RoleHealthBuffModel(1);
        
    }
}
