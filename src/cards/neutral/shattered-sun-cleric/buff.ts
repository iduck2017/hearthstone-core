import { useChild, useMemo, useRoute } from "set-piece";
import { FeatModel } from "../../../feats";
import { RoleModel } from "../../../entities/role";
import { RoleAttackBuffModel } from "../../../feats/role-attack-buff";
import { RoleHealthBuffModel } from "../../../feats/role-health-buff";

export class ShatteredSunClericBuffModel extends FeatModel {
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
        this.init();
    }
}
