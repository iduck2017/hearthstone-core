import { useChild, useMemo, useRoute, useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { MinionModel } from "../../minion";
import { BoardOnlyTagModel } from "../../../rules/board-only-tag";
import { ChargeActiveDecor, useChargeActiveFlagDecorConsumer } from "../../../decors/charge-active";

@useModel('southsea-deckhand-feat-model')
export class SouthseaDeckhandFeatModel extends FeatModel {
    protected _brand: symbol = Symbol('southsea-deckhand-feat-model');

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

    // Activate Charge as a reactive aura while the controller has a weapon equipped.
    @useChargeActiveFlagDecorConsumer()
    protected _onChargeActiveDecor(decor: ChargeActiveDecor) {
        if (!this.isActived) return;
        const weapon = this.player?.hero.weapon;
        if (weapon) decor.active();
    }
}
