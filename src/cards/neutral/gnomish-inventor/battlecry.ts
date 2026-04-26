import { BattlecryModel } from "../../../feats/battlecry";
import { Model, useModel } from "set-piece";
import { Selector } from "../../../utils/controller";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";

@useModel('gnomish-inventor-battlecry-model')
export class GnomishInventorBattlecryModel extends BattlecryModel<Model> {
    protected _brand: symbol = Symbol('gnomish-inventor-battlecry-model');

    public getSelector(params: Array<Model | undefined>): Selector<Model> | undefined {
        return undefined;
    }

    @useBattlecryRunHook()
    protected async handleRun(): Promise<void> {
        this.player?.drawCard();
    }
}
