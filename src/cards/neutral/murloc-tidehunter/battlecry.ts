import { BattlecryModel } from "../../../feats/battlecry";
import { MurlocScoutModel } from "../../derivatives/murloc-scout";
import { Model, useRoute } from "set-piece";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";
import { MinionModel } from "../../minion";

export class MurlocTidehunterBattlecryModel extends BattlecryModel<Model> {
    constructor() {
        super();
        this.init();
    }

    public getSelector(params: Array<Model | undefined>): undefined {
        return undefined;
    }


    @useRoute(() => MinionModel)
    private _minion?: MinionModel;

    @useBattlecryRunHook()
    protected async handleRun(): Promise<void> {
        const player = this.player;
        if (!player) return;

        const minion = this._minion;
        if (!minion) return;

        const board = player.board;
        const index = board.cards.indexOf(minion);
        if (index === -1) return;

        const scout = new MurlocScoutModel();
        scout.summon(board, index + 1);
    }
}
