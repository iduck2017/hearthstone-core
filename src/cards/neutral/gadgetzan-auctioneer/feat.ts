import { useChild, useMemo, useRoute, useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { MinionModel } from "../../minion";
import { BoardOnlyTagModel } from "../../../rules/board-only-tag";
import { SpellPlayPostEvent, usePlayerSpellCast } from "../../../event/spell-play";

// Whenever the controller casts a spell, draw a card.
@useModel('gadgetzan-auctioneer-feat-model')
export class GadgetzanAuctioneerFeatModel extends FeatModel {
    protected _brand: symbol = Symbol('gadgetzan-auctioneer-feat-model');

    @useRoute(() => MinionModel)
    private _minion?: MinionModel;
    @useMemo()
    public get role() {
        return this._minion?.role;
    }

    @useChild()
    private _boardOnly: BoardOnlyTagModel;

    constructor() {
        super();
        this._boardOnly = new BoardOnlyTagModel();
    }

    @usePlayerSpellCast()
    private _onSpellPlay(_event: SpellPlayPostEvent) {
        this.player?.drawCard();
    }
}
