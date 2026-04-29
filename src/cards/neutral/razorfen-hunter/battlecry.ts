import { BattlecryModel } from "../../../feats/battlecry";
import { BoarModel } from "../../derivatives/boar";
import { Model, useRoute, useModel } from "set-piece";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";
import { MinionModel } from "../../minion";

@useModel('razorfen-hunter-battlecry-model')
export class RazorfenHunterBattlecryModel extends BattlecryModel<Model> {
    protected _brand: symbol = Symbol('razorfen-hunter-battlecry-model');

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

        const boar = new BoarModel();
        boar.launcher.summon(player, index + 1);
    }
}
