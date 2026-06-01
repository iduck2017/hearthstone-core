import { BattlecryModel } from "../../../feats/battlecry";
import { BoarModel } from "../../derivatives/boar";
import { Model, useRoute, useModel } from "set-piece";
import { useBattlecryLaunchHook } from "../../../feats/battlecry";
import { MinionModel } from "../../minion";

@useModel('razorfen-hunter-battlecry-model')
export class RazorfenHunterBattlecryModel extends BattlecryModel<Model> {
    protected _brand: symbol = Symbol('razorfen-hunter-battlecry-model');

@useRoute(() => MinionModel)
    private _minion?: MinionModel;

    @useBattlecryLaunchHook()
    protected async handleRun(): Promise<void> {
        const player = this.player;
        if (!player) return;

        const minion = this._minion;
        if (!minion) return;

        const board = player.board;
        const index = board.cards.indexOf(minion);
        if (index === -1) return;

        const boar = new BoarModel();
        boar.deployer.summon(player, index + 1);
    }
}
