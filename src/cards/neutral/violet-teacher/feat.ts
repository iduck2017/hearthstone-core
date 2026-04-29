import { useChild, useMemo, useRoute, useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { MinionModel } from "../../minion";
import { BoardOnlyTagModel } from "../../../rules/board-only-tag";
import { SpellPlayPostEvent, usePlayerSpellCast } from "../../../event/spell-play";
import { VioletApprenticeModel } from "../../derivatives/violet-apprentice";

// Whenever the controller casts a spell, summon a 1/1 Violet Apprentice to the right of this minion.
@useModel('violet-teacher-feat-model')
export class VioletTeacherFeatModel extends FeatModel {
    protected _brand: symbol = Symbol('violet-teacher-feat-model');

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
    protected _onSpellPlay(_event: SpellPlayPostEvent) {
        const player = this.player;
        const minion = this._minion;
        if (!player || !minion) return;
        const board = player.board;
        const index = board.cards.indexOf(minion);
        const apprentice = new VioletApprenticeModel();
        apprentice.summon(player, index + 1);
    }
}
