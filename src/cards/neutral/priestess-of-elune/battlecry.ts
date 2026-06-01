import { BattlecryModel } from "../../../feats/battlecry";
import { Model, useModel } from "set-piece";
import { useBattlecryLaunchHook } from "../../../feats/battlecry";

@useModel('priestess-of-elune-battlecry-model')
export class PriestessOfEluneBattlecryModel extends BattlecryModel<Model> {
    protected _brand: symbol = Symbol('priestess-of-elune-battlecry-model');

    @useBattlecryLaunchHook()
    private async handleRun(): Promise<void> {
        const hero = this.player?.hero;
        if (!hero) return;
        hero.restoreSource.launch({ target: hero.role, value: 4 });
    }
}
