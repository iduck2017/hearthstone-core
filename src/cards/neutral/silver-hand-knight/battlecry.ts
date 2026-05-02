import { BattlecryModel } from "../../../feats/battlecry";
import { SquireModel } from "../../derivatives/squire";
import { Model, useRoute, useModel } from "set-piece";
import { useBattlecryLaunchHook } from "../../../hooks/battlecry-launcher";
import { MinionModel } from "../../minion";

@useModel('silver-hand-knight-battlecry-model')
export class SilverHandKnightBattlecryModel extends BattlecryModel<Model> {
    protected _brand: symbol = Symbol('silver-hand-knight-battlecry-model');

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
        const squire = new SquireModel();
        squire.launcher.summon(player, index + 1);
    }
}
