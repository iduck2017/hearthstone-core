import { useMemo, useRoute, useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { MinionModel } from "../../minion";
import { BoardOnlyControllerModel } from "../../../feats/board-only-controller";
import { SpellPlayPostEvent, usePlayerSpellCast } from "../../../rules/deployers/spell-deployer";

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

    constructor() {
        super({ subFeats: [new BoardOnlyControllerModel()] });
    }

    @usePlayerSpellCast()
    private _onSpellPlay(_event: SpellPlayPostEvent) {
        this.player?.drawCard();
    }
}
