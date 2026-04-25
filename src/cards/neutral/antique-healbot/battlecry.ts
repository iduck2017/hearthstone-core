import { BattlecryModel } from "../../../feats/battlecry";
import { Selector } from "../../../utils/controller";
import { Model } from "set-piece";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";

export class AntiqueHealbotBattlecryModel extends BattlecryModel<Model> {
    public getSelector(): Selector<Model> | undefined {
        return undefined;
    }

    @useBattlecryRunHook()
    private async handleRun(): Promise<void> {
        const hero = this.player?.hero;
        if (!hero) return;
        hero.restoreSource.restoreHealth({ target: hero.role, value: 8 });
    }
}
