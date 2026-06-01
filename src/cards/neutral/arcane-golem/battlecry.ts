import { Model, useAction, useModel } from "set-piece";
import { BattlecryModel, useBattlecryLaunchHook } from "../../../feats/battlecry";

@useModel('arcane-golem-battlecry-model')
export class ArcaneGolemBattlecryModel extends BattlecryModel<Model> {
    protected _brand: symbol = Symbol('arcane-golem-battlecry-model');

    @useBattlecryLaunchHook()
    @useAction()
    protected async handleRun(): Promise<void> {
        const opponent = this.player?.opponent;
        if (!opponent) return;
        opponent.mana.upgrade(1);
        opponent.mana.restore(1);
    }
}
