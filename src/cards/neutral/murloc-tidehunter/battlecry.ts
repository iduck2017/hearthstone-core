import { BattlecryModel } from "../../../features/battlecry";
import { MurlocScoutModel } from "../../derivatives/murloc-scout";
import { Model, useMemo, useRoute } from "set-piece";
import { MinionModel } from "../../minion";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";

export class MurlocTidehunterBattlecryModel extends BattlecryModel<Model> {
    constructor() {
        super();
        this.init();
    }

    @useRoute(() => MinionModel)
    private _minion?: MinionModel;
    @useMemo()
    public get minion() {
        return this._minion;
    }

    public getSelector(params: Array<Model | undefined>): undefined {
        return undefined;
    }

    @useBattlecryRunHook()
    protected async handleRun(): Promise<void> {
        const player = this.player;
        if (!player) return;

        const minion = this.minion;
        if (!minion) return;

        const board = player.board;
        const index = board.cards.indexOf(minion);
        if (index === -1) return;

        const scout = new MurlocScoutModel();
        scout.summon(board, index + 1);
    }
}
