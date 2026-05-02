import { BattlecryModel } from "../../../feats/battlecry";
import { Model, useModel } from "set-piece";
import { useBattlecryLaunchHook } from "../../../hooks/battlecry-launcher";

@useModel('priestess-of-elune-battlecry-model')
export class PriestessOfEluneBattlecryModel extends BattlecryModel<Model> {
    protected _brand: symbol = Symbol('priestess-of-elune-battlecry-model');

    @useBattlecryLaunchHook()
    private async handleRun(): Promise<void> {
        const hero = this.player?.hero;
        if (!hero) return;
        hero.restoreSource.restoreHealth({ target: hero.role, value: 4 });
    }
}
