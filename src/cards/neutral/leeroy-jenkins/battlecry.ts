import { BattlecryModel } from "../../../feats/battlecry";
import { WhelpModel } from "../../derivatives/whelp";
import { Model, useModel } from "set-piece";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";

@useModel('leeroy-jenkins-battlecry-model')
export class LeeroyJenkinsBattlecryModel extends BattlecryModel<Model> {
    protected _brand: symbol = Symbol('leeroy-jenkins-battlecry-model');

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
