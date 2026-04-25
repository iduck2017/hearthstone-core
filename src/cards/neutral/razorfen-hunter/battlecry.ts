import { BattlecryModel } from "../../../features/battlecry";
import { BoarModel } from "../../derivatives/boar";
import { Model } from "set-piece";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";

export class RazorfenHunterBattlecryModel extends BattlecryModel<Model> {
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

        const boar = new BoarModel();
        boar.summon(board, index + 1);
    }
}
