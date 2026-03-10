import { BattlecryModel } from "../../../hooks/battlecry";
import { Selector } from "../../../utils/controller";
import { RoleModel } from "../../../entities/role";
import { DarkIronDwarfBuffModel } from "./buff";

export class DarkIronDwarfBattlecryModel extends BattlecryModel<RoleModel> {

    public getSelector(params: Array<RoleModel | undefined>): Selector<RoleModel> | undefined {
        const player = this.player;
        if (!player) return;
        const options = player.board.minions.map(minion => minion.role);
        return { options };
    }

    protected async _run(params: Array<RoleModel | undefined>): Promise<void> {
        const target = params[0];
        if (!target) return;
        target.container?.addBuff(new DarkIronDwarfBuffModel());
    }
}
