import { BattlecryModel } from "../../../feats/battlecry";
import { Model, useModel } from "set-piece";
import { useBattlecryLaunchHook } from "../../../hooks/battlecry-launcher";

@useModel('gnomish-inventor-battlecry-model')
export class GnomishInventorBattlecryModel extends BattlecryModel<Model> {
    protected _brand: symbol = Symbol('gnomish-inventor-battlecry-model');

    @useBattlecryLaunchHook()
    protected async handleRun(): Promise<void> {
        this.player?.drawCard();
    }
}
