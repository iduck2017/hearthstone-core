import { BattlecryModel } from "../../../feats/battlecry";
import { Model, useModel } from "set-piece";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";

@useModel('coldlight-oracle-battlecry-model')
export class ColdlightOracleBattlecryModel extends BattlecryModel<Model> {
    protected _brand: symbol = Symbol('coldlight-oracle-battlecry-model');

    @useBattlecryRunHook()
    protected async handleRun(): Promise<void> {
        const player = this.player;
        const opponent = player?.opponent;
        if (!player || !opponent) return;
        // Draw 2 cards for each player
        player.drawCard();
        player.drawCard();
        opponent.drawCard();
        opponent.drawCard();
    }
}
