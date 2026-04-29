import { BattlecryModel } from "../../../feats/battlecry";
import { Model, useModel } from "set-piece";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";

@useModel('gnomish-inventor-battlecry-model')
export class GnomishInventorBattlecryModel extends BattlecryModel<Model> {
    protected _brand: symbol = Symbol('gnomish-inventor-battlecry-model');

    @useBattlecryRunHook()
    protected async handleRun(): Promise<void> {
        this.player?.drawCard();
    }
}
