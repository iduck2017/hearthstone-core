import { BattlecryModel } from "../../../feats/battlecry";
import { Model, useRoute, useModel } from "set-piece";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";
import { Selector } from "../../../utils/controller";
import { RoleModel } from "../../../entities/role";
import { MinionModel } from "../../minion";

@useModel('injured-blademaster-battlecry-model')
export class InjuredBlademasterBattlecryModel extends BattlecryModel<Model> {
    protected _brand: symbol = Symbol('injured-blademaster-battlecry-model');

    public getSelector(): Selector<Model> | undefined {
        return undefined;
    }

    @useRoute(() => MinionModel)
    private _minion?: MinionModel;

    @useBattlecryRunHook()
    protected async handleRun(): Promise<void> {
        const minion = this._minion;
        if (!minion) return;
        minion.damageSource.dealDamage({ target: minion.role, value: 4 });
    }
}
