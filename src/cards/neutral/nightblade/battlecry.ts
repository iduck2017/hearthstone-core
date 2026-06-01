import { BattlecryModel } from "../../../feats/battlecry";
import { Model, useModel } from "set-piece";
import { useBattlecryLaunchHook } from "../../../feats/battlecry";

@useModel('nightblade-battlecry-model')
export class NightbladeBattlecryModel extends BattlecryModel<Model> {
    protected _brand: symbol = Symbol('nightblade-battlecry-model');

    @useBattlecryLaunchHook()
    protected async handleRun(): Promise<void> {
        const opponent = this.player?.opponent;
        if (!opponent) return;
        this.entity?.damageSource.launch({ target: opponent.hero.role, value: 3 });
    }
}
