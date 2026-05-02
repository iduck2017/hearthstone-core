import { BattlecryModel } from "../../../feats/battlecry";
import { Model, useModel } from "set-piece";
import { useBattlecryLaunchHook } from "../../../feats/battlecry";

@useModel('antique-healbot-battlecry-model')
export class AntiqueHealbotBattlecryModel extends BattlecryModel<Model> {
    protected _brand: symbol = Symbol('antique-healbot-battlecry-model');
    
    @useBattlecryLaunchHook()
    private async handleRun(): Promise<void> {
        const hero = this.player?.hero;
        if (!hero) return;
        hero.restoreSource.restoreHealth({ target: hero.role, value: 8 });
    }
}
