import { useChild, useMemo, useRoute, useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { MinionModel } from "../../minion";
import { BoardOnlyTagModel } from "../../../rules/board-only-tag";
import { RoleDamageReceivePostEvent, useRoleDamageReceiveEventConsumer } from "../../../event/role-damage-receive";

@useModel('acolyte-of-pain-feat-model')
export class AcolyteOfPainFeatModel extends FeatModel {
    protected _brand: symbol = Symbol('acolyte-of-pain-feat-model');
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

    // Whenever this minion takes damage, draw a card for its controller.
    @useRoleDamageReceiveEventConsumer()
    private _onDamageReceive(event: RoleDamageReceivePostEvent) {
        this.player?.drawCard();
    }
}
