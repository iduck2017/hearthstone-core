import { BattlecryModel } from "../../../feats/battlecry";
import { Model, useRoute } from "set-piece";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";
import { Selector } from "../../../utils/controller";
import { RoleModel } from "../../../entities/role";
import { MinionModel } from "../../minion";

export class InjuredBlademasterBattlecryModel extends BattlecryModel<Model> {
    constructor() {
        super();
        this.init();
    }

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
