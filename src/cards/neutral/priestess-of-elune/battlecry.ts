import { BattlecryModel } from "../../../feats/battlecry";
import { Model, useModel } from "set-piece";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";

@useModel('priestess-of-elune-battlecry-model')
export class PriestessOfEluneBattlecryModel extends BattlecryModel<Model> {
    protected _brand: symbol = Symbol('priestess-of-elune-battlecry-model');

    @useBattlecryRunHook()
    private async handleRun(): Promise<void> {
        const hero = this.player?.hero;
        if (!hero) return;
        hero.restoreSource.restoreHealth({ target: hero.role, value: 4 });
    }
}
