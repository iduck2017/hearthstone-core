import { useModel } from "set-piece";
import { BattlecryModel } from "../../../feats/battlecry";
import { Model } from "set-piece";
import { Selector } from "../../../utils/controller";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";

@useModel('azure-drake-battlecry-model')
export class AzureDrakeBattlecryModel extends BattlecryModel<Model> {
    protected _brand: symbol = Symbol('azure-drake-battlecry-model');

    public getSelector(): Selector<Model> | undefined {
        return undefined;
    }

    @useBattlecryRunHook()
    protected async handleRun(): Promise<void> {
        this.player?.drawCard();
    }
}
