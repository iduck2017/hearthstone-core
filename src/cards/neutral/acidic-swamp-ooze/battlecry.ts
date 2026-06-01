import { Model, useModel } from "set-piece";
import { BattlecryModel } from "../../../feats/battlecry";
import { useBattlecryLaunchHook } from "../../../feats/battlecry";

@useModel('acidic-swamp-ooze-battlecry-model')
export class AcidicSwampOozeBattlecryModel extends BattlecryModel<Model> {
    protected _brand: symbol = Symbol('acidic-swamp-ooze-battlecry-model');

    @useBattlecryLaunchHook()
    protected async handleRun(): Promise<void> {
        const opponent = this.player?.opponent;
        const weapon = opponent?.hero.weapon;
        if (!opponent || !weapon) return;
        weapon.disposer.destroy();
    }
}
