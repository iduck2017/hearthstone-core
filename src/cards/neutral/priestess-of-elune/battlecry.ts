import { BattlecryModel } from "../../../feats/battlecry";
import { Selector } from "../../../utils/controller";
import { Model, useModel } from "set-piece";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";

@useModel('priestess-of-elune-battlecry-model')
export class PriestessOfEluneBattlecryModel extends BattlecryModel<Model> {
    protected _brand: symbol = Symbol('priestess-of-elune-battlecry-model');
    public getSelector(): Selector<Model> | undefined {
        return undefined;
    }

    @useBattlecryRunHook()
    private async handleRun(): Promise<void> {
        const hero = this.player?.hero;
        if (!hero) return;
        hero.restoreSource.restoreHealth({ target: hero.role, value: 4 });
    }
}
