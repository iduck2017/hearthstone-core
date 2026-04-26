import { useChild, useMemo, useRoute, useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { MinionModel } from "../../minion";
import { SpellDamageDecor, usePlayerSpellDamageDecorConsumer } from "../../../decors/spell-damage";
import { BoardOnlyTagModel } from "../../../rules/board-only-tag";
import { BuffOperatorType } from "../../../decors/role-attack";

@useModel('kobold-geomancer-feat-model')
export class KoboldGeomancerFeatModel extends FeatModel {
    protected _brand: symbol = Symbol('kobold-geomancer-feat-model');
    @useRoute(() => MinionModel)
    private _minion?: MinionModel;
    @useMemo()
    public get role() {
        return this._minion?.role ?? this._hero?.role;
    }

    @useChild()
    private _boardOnly: BoardOnlyTagModel;

    constructor() {
        super();
        this._boardOnly = new BoardOnlyTagModel();
        
    }

    // Grant +1 spell damage to all friendly spells in hand as a reactive aura.
    @usePlayerSpellDamageDecorConsumer()
    protected _onSpellDamageDecor(decor: SpellDamageDecor) {
        decor.addBuff({
            value: 1,
            type: BuffOperatorType.AURA,
            source: this,
        });
    }
}
