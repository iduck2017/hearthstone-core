import { useModel, useRoute, useMemo } from "set-piece";
import { FeatModel } from "../../../feats";
import { MinionModel } from "../../minion";
import { BoardOnlyControllerModel } from "../../../feats/board-only-controller";
import { CardPlayPostEvent, usePlayerCardPlay } from "../../../rules/deployers/card-deployer";
import { SatyrModel } from "../../derivatives/satyr";

@useModel('xavius-feat-model')
export class XaviusFeatModel extends FeatModel {
    protected _brand: symbol = Symbol('xavius-feat-model');

    @useRoute(() => MinionModel)
    private _minion?: MinionModel;
    @useMemo()
    public get role() {
        return this._minion?.role;
    }

    constructor() {
        super({ subFeats: [new BoardOnlyControllerModel()] });
    }

    @usePlayerCardPlay()
    private _handleCardPlay(event: CardPlayPostEvent) {
        const player = this.player;
        if (!player) return;
        const minion = this._minion;
        if (!minion) return;
        if (event.card === minion) return;
        const board = player.board;
        const index = board.cards.indexOf(minion);
        if (index === -1) return;
        const satyr = new SatyrModel();
        satyr.deployer.summon(player, index + 1);
    }
}
