import { useModel } from "set-piece";
import { BattlecryModel } from "../../../feats/battlecry";
import { Selector } from "../../../utils/controller";
import { RoleModel } from "../../../entities/role";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";

@useModel('ironforge-rifleman-battlecry-model')
export class IronforgeRiflemanBattlecryModel extends BattlecryModel<RoleModel> {
    protected _brand: symbol = Symbol('ironforge-rifleman-battlecry-model');

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
        this.entity?.damageSource.dealDamage({ target, value: 1 });
    }
}
