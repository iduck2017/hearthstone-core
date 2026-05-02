import { useModel } from "set-piece";
import { BattlecryModel } from "../../../feats/battlecry";
import { Model } from "set-piece";
import { useBattlecryLaunchHook } from "../../../feats/battlecry";

@useModel('azure-drake-battlecry-model')
export class AzureDrakeBattlecryModel extends BattlecryModel<Model> {
    protected _brand: symbol = Symbol('azure-drake-battlecry-model');

    @useBattlecryLaunchHook()
    protected async handleRun(): Promise<void> {
        this.player?.drawCard();
    }
}
