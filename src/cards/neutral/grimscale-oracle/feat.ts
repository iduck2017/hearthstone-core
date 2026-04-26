import { useChild, useMemo, useRoute, useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { MinionModel } from "../../minion";
import { BuffOperatorType, RoleAttackDecor, useAllyRoleAttackDecorConsumer } from "../../../decors/role-attack";
import { BoardOnlyTagModel } from "../../../rules/board-only-tag";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RaceType } from "../../../rules/race";

@useModel('grimscale-oracle-feat-model')
export class GrimscaleOracleFeatModel extends FeatModel {
    protected _brand: symbol = Symbol('grimscale-oracle-feat-model');
    @useRoute(() => MinionModel)
    private _minion?: MinionModel;
    @useMemo()
    public get role() {
        return this._minion?.role ?? this._hero?.role;
    }

    @useChild()
    private isBoardOnly: BoardOnlyTagModel;

    constructor() {
        super();
        this.isBoardOnly = new BoardOnlyTagModel();
        
    }

    // Grant +1 Attack to every other allied Murloc as a reactive aura.
    @useAllyRoleAttackDecorConsumer()
    protected _onAllyAttackDecor(decor: RoleAttackDecor) {
        // Skip self
        if (decor.target === this.role?.attack) return;
        // Only buff Murloc allies
        if (!(decor.target instanceof RoleAttackModel)) return; 
        if (!decor.target.minion?.races.includes(RaceType.MURLOC)) return;
        decor.addBuff({
            value: 1,
            type: BuffOperatorType.AURA,
            source: this,
        });
    }
}
