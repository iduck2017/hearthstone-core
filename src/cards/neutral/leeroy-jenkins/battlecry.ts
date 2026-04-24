import { BattlecryModel } from "../../../features/battlecry";
import { WhelpModel } from "../../derivatives/whelp";
import { Model } from "set-piece";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";

export class LeeroyJenkinsBattlecryModel extends BattlecryModel<Model> {
    constructor() {
        super();
        this.init();
    }

    public getSelector(): undefined {
        return undefined;
    }

    @useBattlecryRunHook()
    protected async handleRun(): Promise<void> {
        const opponent = this.player?.opponent;
        if (!opponent) return;
        const board = opponent.board;
        new WhelpModel().summon(board);
        new WhelpModel().summon(board);
    }
}
