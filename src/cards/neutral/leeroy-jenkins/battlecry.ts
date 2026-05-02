import { BattlecryModel } from "../../../feats/battlecry";
import { WhelpModel } from "../../derivatives/whelp";
import { Model, useAction, useModel } from "set-piece";
import { useBattlecryLaunchHook } from "../../../hooks/battlecry-launcher";
import { PlayerModel } from "../../../entities/player";

@useModel('leeroy-jenkins-battlecry-model')
export class LeeroyJenkinsBattlecryModel extends BattlecryModel<Model> {
    protected _brand: symbol = Symbol('leeroy-jenkins-battlecry-model');

    @useBattlecryLaunchHook()
    @useAction()
    protected async handleRun(): Promise<void> {
        const opponent = this.player?.opponent;
        if (!opponent) return;
        const board = opponent.board;
        const length = board.cards.length;
        new WhelpModel().deployer.summon(opponent, length);
        new WhelpModel().deployer.summon(opponent, length);
    }

}
