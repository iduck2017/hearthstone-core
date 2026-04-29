import { BattlecryModel } from "../../../feats/battlecry";
import { Model, useModel } from "set-piece";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";

@useModel('novice-engineer-battlecry-model')
export class NoviceEngineerBattlecryModel extends BattlecryModel<Model> {
    protected _brand: symbol = Symbol('novice-engineer-battlecry-model');

    @useBattlecryRunHook()
    protected async handleRun(): Promise<void> {
        this.player?.drawCard();
    }
}
