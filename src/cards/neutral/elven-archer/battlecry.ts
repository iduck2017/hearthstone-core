import { BattlecryModel } from "../../../features/battlecry";
import { Selector } from "../../../utils/controller";
import { RoleModel } from "../../../entities/role";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";

export class ElvenArcherBattlecryModel extends BattlecryModel<RoleModel> {
    public getSelector(_params: Array<RoleModel | undefined>): Selector<RoleModel> | undefined {
        const player = this.player;
        const opponent = player?.opponent;
        if (!opponent) return;
        const board = opponent.board;
        const options = [...board.minions, opponent.hero].map(item => item.role);
        return { options }
    }

    @useBattlecryRunHook()
    private async handleRun(target?: RoleModel): Promise<void> {
        if (!target) return;
        this.entity?.damageSource.dealDamage({ target, value: 1 });
    }
}
