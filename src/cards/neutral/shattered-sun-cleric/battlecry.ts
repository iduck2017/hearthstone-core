import { BattlecryModel } from "../../../hooks/battlecry";
import { Selector } from "../../../utils/controller";
import { RoleModel } from "../../../entities/role";
import { RoleAttackDecorModel, RoleAttackDecorType } from "../../../rules/role-attack-decor";
import { RoleHealthDecorModel, RoleHealthDecorType } from "../../../rules/role-health-decor";
import { ShatteredSunClericBuffModel } from "./buff";

export class ShatteredSunClericBattlecryModel extends BattlecryModel<RoleModel> {

    public getSelector(params: Array<RoleModel | undefined>): Selector<RoleModel> | undefined {
        const player = this.player;
        if (!player) return;
        const options = player.board.minions.map(minion => minion.role);
        return { options };
    }

    protected async _run(params: Array<RoleModel | undefined>): Promise<void> {
        const target = params[0];
        if (!target) return;
        target.container?.addBuff(new ShatteredSunClericBuffModel());
    }
}
