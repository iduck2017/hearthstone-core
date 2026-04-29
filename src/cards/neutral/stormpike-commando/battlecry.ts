import { BattlecryModel } from "../../../feats/battlecry";
import { Selector } from "../../../utils/controller";
import { RoleModel } from "../../../entities/role";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";
import { useBattlecrySelectHook } from "../../../hooks/battlecry-selector";
import { useRoute, useModel } from "set-piece";
import { MinionModel } from "../../minion";

@useModel('stormpike-commando-battlecry-model')
export class StormpikeCommandoBattlecryModel extends BattlecryModel<RoleModel> {
    protected _brand: symbol = Symbol('stormpike-commando-battlecry-model');

    @useBattlecrySelectHook()
    protected handleSelect(): Selector<RoleModel> | undefined {
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
