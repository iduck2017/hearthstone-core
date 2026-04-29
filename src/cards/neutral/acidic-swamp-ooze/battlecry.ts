import { Model, useModel } from "set-piece";
import { BattlecryModel } from "../../../feats/battlecry";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";
import { Selector } from "../../../utils/controller";

@useModel('acidic-swamp-ooze-battlecry-model')
export class AcidicSwampOozeBattlecryModel extends BattlecryModel<Model> {
    protected _brand: symbol = Symbol('acidic-swamp-ooze-battlecry-model');

    public getSelector(): Selector<Model> | undefined {
        return undefined;
    }

    @useBattlecryRunHook()
    protected async handleRun(): Promise<void> {
        const opponent = this.player?.opponent;
        const weapon = opponent?.hero.weapon;
        if (!opponent || !weapon) return;
        weapon.disposer.destroy();
    }
}
