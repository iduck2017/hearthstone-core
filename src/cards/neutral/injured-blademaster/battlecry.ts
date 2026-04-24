import { useMemo, useRoute } from "set-piece";
import { BattlecryModel } from "../../../features/battlecry";
import { Model } from "set-piece";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";
import { MinionModel } from "../../minion";
import { Selector } from "../../../utils/controller";

export class InjuredBlademasterBattlecryModel extends BattlecryModel<Model> {
    @useRoute(() => MinionModel)
    private _minion?: MinionModel;

    constructor() {
        super();
        this.init();
    }

    public getSelector(): Selector<Model> | undefined {
        return undefined;
    }

    @useBattlecryRunHook()
    protected async handleRun(): Promise<void> {
        const role = this._minion?.role;
        if (!role) return;
        role.dealDamage({ target: role, value: 4 });
    }
}
