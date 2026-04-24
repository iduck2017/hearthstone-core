import { useMemo, useRoute } from "set-piece";
import { BattlecryModel } from "../../../features/battlecry";
import { Selector } from "../../../utils/controller";
import { RoleModel } from "../../../entities/role";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";
import { MinionModel } from "../../minion";

export class ElvenArcherBattlecryModel extends BattlecryModel<RoleModel> {
    @useRoute(() => MinionModel)
    private _minion?: MinionModel;
    @useMemo()
    public get minion() {
        return this._minion;
    }

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
        this._minion?.damageSource.dealDamage({ target, value: 1 });
    }
}
