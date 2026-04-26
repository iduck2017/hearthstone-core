import { BattlecryModel } from "../../../feats/battlecry";
import { Model, useModel } from "set-piece";
import { Selector } from "../../../utils/controller";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";

@useModel('novice-engineer-battlecry-model')
export class NoviceEngineerBattlecryModel extends BattlecryModel<Model> {
    protected _brand: symbol = Symbol('novice-engineer-battlecry-model');

    public getSelector(params: Array<Model | undefined>): Selector<Model> | undefined {
        return undefined;
    }

    @useBattlecryRunHook()
    protected async handleRun(): Promise<void> {
        this.player?.drawCard();
    }
}
