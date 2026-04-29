import { BattlecryModel } from "../../../feats/battlecry";
import { MurlocScoutModel } from "../../derivatives/murloc-scout";
import { Model, useRoute, useModel } from "set-piece";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";
import { MinionModel } from "../../minion";

@useModel('murloc-tidehunter-battlecry-model')
export class MurlocTidehunterBattlecryModel extends BattlecryModel<Model> {
    protected _brand: symbol = Symbol('murloc-tidehunter-battlecry-model');

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
        const scout = new MurlocScoutModel();
        scout.launcher.summon(player, index + 1);
    }
}
