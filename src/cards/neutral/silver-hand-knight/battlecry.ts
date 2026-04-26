import { BattlecryModel } from "../../../feats/battlecry";
import { SquireModel } from "../../derivatives/squire";
import { Model, useRoute, useModel } from "set-piece";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";
import { MinionModel } from "../../minion";

@useModel('silver-hand-knight-battlecry-model')
export class SilverHandKnightBattlecryModel extends BattlecryModel<Model> {
    protected _brand: symbol = Symbol('silver-hand-knight-battlecry-model');

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

        const squire = new SquireModel();
        squire.summon(board, index + 1);
    }
}
