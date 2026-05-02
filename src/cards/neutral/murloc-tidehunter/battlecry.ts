import { BattlecryModel } from "../../../feats/battlecry";
import { MurlocScoutModel } from "../../derivatives/murloc-scout";
import { Model, useRoute, useModel } from "set-piece";
import { useBattlecryLaunchHook } from "../../../hooks/battlecry-launcher";
import { MinionModel } from "../../minion";

@useModel('murloc-tidehunter-battlecry-model')
export class MurlocTidehunterBattlecryModel extends BattlecryModel<Model> {
    protected _brand: symbol = Symbol('murloc-tidehunter-battlecry-model');

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
        const scout = new MurlocScoutModel();
        scout.deployer.summon(player, index + 1);
    }
}
