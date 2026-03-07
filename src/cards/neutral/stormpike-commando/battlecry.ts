import { BattlecryModel } from "../../../hooks/battlecry";
import { Selector } from "../../../utils/controller";
import { RoleModel } from "../../../entities/role";

export class StormpikeCommandoBattlecryModel extends BattlecryModel<RoleModel> {

    public getSelector(): Selector<RoleModel> | undefined {
        const player = this.player;
        const opponent = player?.opponent;
        if (!opponent) return;
        const options = [...opponent.board.minions, opponent.hero].map(item => item.role);
        return { options };
    }

    protected async _run(params: Array<RoleModel | undefined>): Promise<void> {
        const target = params[0];
        if (!target) return;
        target.receiveDamage({ value: 2 });
    }
}
