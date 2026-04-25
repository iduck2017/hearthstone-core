import { BattlecryModel } from "../../../features/battlecry";
import { Selector } from "../../../utils/controller";
import { RoleModel } from "../../../entities/role";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";

export class StormpikeCommandoBattlecryModel extends BattlecryModel<RoleModel> {
    constructor() {
        super();
        this.init();
    }

    public getSelector(): Selector<RoleModel> | undefined {
        const player = this.player;
        const opponent = player?.opponent;
        if (!opponent) return;
        const options = [...opponent.board.minions, opponent.hero].map(item => item.role);
        return { options };
    }

    @useBattlecryRunHook()
    protected async handleRun(target?: RoleModel): Promise<void> {
        if (!target) return;
        this._minion?.damageSource.dealDamage({ target, value: 2 });
    }
}
