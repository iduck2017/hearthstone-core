import { BattlecryModel } from "../../../features/battlecry";
import { MurlocScoutModel } from "../../derivatives/murloc-scout";
import { Model } from "set-piece";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";

export class MurlocTidehunterBattlecryModel extends BattlecryModel<Model> {
    constructor() {
        super();
        this.init();
    }

    public getSelector(params: Array<Model | undefined>): undefined {
        return undefined;
    }

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
