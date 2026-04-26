import { useModel } from "set-piece";
import { BattlecryModel } from "../../../feats/battlecry";
import { Selector } from "../../../utils/controller";
import { RoleModel } from "../../../entities/role";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";

@useModel('elven-archer-battlecry-model')
export class ElvenArcherBattlecryModel extends BattlecryModel<RoleModel> {
    protected _brand: symbol = Symbol('elven-archer-battlecry-model');
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
