import { useChild } from "set-piece";
import { FeatModel } from "../../../feats";
import { RoleAttackBuffModel } from "../../../feats/role-attack-buff";

const ENRAGE_ATTACK = 3;

export class GurubashiBerserkerBuffModel extends FeatModel {
    @useChild()
    public attackBuff: RoleAttackBuffModel;

    constructor() {
        super();
        // Add a permanent +3 attack buff each time this buff instance is active.
        this.attackBuff = new RoleAttackBuffModel(ENRAGE_ATTACK);
        this.init();
    }
}
