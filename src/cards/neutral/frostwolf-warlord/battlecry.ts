import { BattlecryModel } from "../../../feats/battlecry";
import { Model, useModel } from "set-piece";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";
import { FrostwolfWarlordBuffModel } from "./buff";

@useModel('frostwolf-warlord-battlecry-model')
export class FrostwolfWarlordBattlecryModel extends BattlecryModel<Model> {
    protected _brand: symbol = Symbol('frostwolf-warlord-battlecry-model');

    @useBattlecryRunHook()
    protected async handleRun(): Promise<void> {
        const player = this.player;
        if (!player) return;
        // Warlord is already on board when battlecry fires; subtract 1 to exclude self
        const n = player.board.minions.length - 1;
        if (n <= 0) return;
        this.entity?.addFeat(new FrostwolfWarlordBuffModel(n));
    }
}
