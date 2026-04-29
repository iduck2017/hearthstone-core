import { useMemo, useRoute, useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { MinionModel } from "../../minion";
import { BoardOnlyControllerModel } from "../../../feats/board-only-controller";
import { SpellPlayPostEvent, usePlayerSpellCast } from "../../../event/spell-play";
import { ManaAddictBuffModel } from "./buff";

// Whenever the controller casts a spell, attach a temporary +2 Attack buff to this minion.
@useModel('mana-addict-feat-model')
export class ManaAddictFeatModel extends FeatModel {
    protected _brand: symbol = Symbol('mana-addict-feat-model');

    @useRoute(() => MinionModel)
    private _minion?: MinionModel;
    @useMemo()
    public get role() {
        return this._minion?.role;
    }

    constructor() {
        super({ subFeats: [new BoardOnlyControllerModel()] });
    }

    @usePlayerSpellCast()
    private _onSpellPlay(_event: SpellPlayPostEvent) {
        this.entity?.addFeat(new ManaAddictBuffModel());
    }
}
