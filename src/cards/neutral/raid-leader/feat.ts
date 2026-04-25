import { useChild, useMemo, useRoute } from "set-piece";
import { FeatModel } from "../../../feats";
import { MinionModel } from "../../minion";
import { BuffOperatorType, RoleAttackDecor, useAllyRoleAttackDecorConsumer } from "../../../decors/role-attack";
import { BoardOnlyTagModel } from "../../../rules/board-only-tag";

export class RaidLeaderFeatModel extends FeatModel {
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
        this.init();
    }

    // Grant +1 Attack to every other allied minion as a reactive aura.
    // Skip self by comparing decor.target against this minion's own attack model.
    @useAllyRoleAttackDecorConsumer()
    protected _onAllyAttackDecor(decor: RoleAttackDecor) {
        if (decor.target === this.role?.attack) return;
        decor.addBuff({
            value: 1,
            type: BuffOperatorType.AURA,
            source: this,
        });
    }
}
