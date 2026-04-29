import { BattlecryModel } from "../../../feats/battlecry";
import { Model, useModel } from "set-piece";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";

@useModel('antique-healbot-battlecry-model')
export class AntiqueHealbotBattlecryModel extends BattlecryModel<Model> {
    protected _brand: symbol = Symbol('antique-healbot-battlecry-model');
    
    @useBattlecryRunHook()
    private async handleRun(): Promise<void> {
        const hero = this.player?.hero;
        if (!hero) return;
        hero.restoreSource.restoreHealth({ target: hero.role, value: 8 });
    }
}
