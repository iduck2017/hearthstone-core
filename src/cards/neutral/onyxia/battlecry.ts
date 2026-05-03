import { useModel, useRoute, Model } from "set-piece";
import { BattlecryModel } from "../../../feats/battlecry";
import { useBattlecryLaunchHook } from "../../../feats/battlecry";
import { MinionModel } from "../../minion";
import { WhelpModel } from "../../derivatives/whelp";

@useModel('onyxia-battlecry-model')
export class OnyxiaBattlecryModel extends BattlecryModel<Model> {
    protected _brand: symbol = Symbol('onyxia-battlecry-model');

    @useRoute(() => MinionModel)
    private _minion?: MinionModel;

    @useBattlecryLaunchHook()
    protected async handleRun(): Promise<void> {
        const player = this.player;
        const minion = this._minion;
        if (!player || !minion) return;
        const boardSize = 7;
        const board = player.board;
        while (board.minions.length < boardSize) {
            const whelp = new WhelpModel();
            const index = board.minions.length;
            whelp.deployer.summon(player, index);
        }
    }
}
