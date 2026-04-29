import { BattlecryModel } from "../../../feats/battlecry";
import { WhelpModel } from "../../derivatives/whelp";
import { Model, useAction, useModel } from "set-piece";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";
import { PlayerModel } from "../../../entities/player";

@useModel('leeroy-jenkins-battlecry-model')
export class LeeroyJenkinsBattlecryModel extends BattlecryModel<Model> {
    protected _brand: symbol = Symbol('leeroy-jenkins-battlecry-model');

    public getSelector(): undefined {
        return undefined;
    }

    @useBattlecryRunHook()
    @useAction()
    protected async handleRun(): Promise<void> {
        const opponent = this.player?.opponent;
        if (!opponent) return;
        const board = opponent.board;
        const length = board.cards.length;
        new WhelpModel().summon(opponent, length);
        new WhelpModel().summon(opponent, length);
    }

}
