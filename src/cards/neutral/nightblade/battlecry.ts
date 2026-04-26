import { BattlecryModel } from "../../../feats/battlecry";
import { Selector } from "../../../utils/controller";
import { Model, useModel } from "set-piece";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";

@useModel('nightblade-battlecry-model')
export class NightbladeBattlecryModel extends BattlecryModel<Model> {
    protected _brand: symbol = Symbol('nightblade-battlecry-model');

    public getSelector(): Selector<Model> | undefined {
        return undefined;
    }

    @useBattlecryRunHook()
    protected async handleRun(): Promise<void> {
        const opponent = this.player?.opponent;
        if (!opponent) return;
        this.entity?.damageSource.dealDamage({ target: opponent.hero.role, value: 3 });
    }
}
