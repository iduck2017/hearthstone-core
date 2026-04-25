import { BattlecryModel } from "../../../feats/battlecry";
import { Selector } from "../../../utils/controller";
import { RoleModel } from "../../../entities/role";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";
import { useRoute } from "set-piece";
import { MinionModel } from "../../minion";

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
        this.entity?.damageSource.dealDamage({ target, value: 2 });
    }
}
