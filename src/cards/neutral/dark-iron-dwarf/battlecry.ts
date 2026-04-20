import { BattlecryModel } from "../../../features/battlecry";
import { Selector } from "../../../utils/controller";
import { RoleModel } from "../../../entities/role";
import { DarkIronDwarfBuffModel } from "./buff";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";

export class DarkIronDwarfBattlecryModel extends BattlecryModel<RoleModel> {
    constructor() {
        super();
        this.init();
    }

    public getSelector(params: Array<RoleModel | undefined>): Selector<RoleModel> | undefined {
        const player = this.player;
        if (!player) return;
        const options = player.board.minions.map(minion => minion.role);
        return { options };
    }

    @useBattlecryRunHook()
    protected async handleRun(target?: RoleModel): Promise<void> {
        if (!target) return;
        target.addFeature(new DarkIronDwarfBuffModel());
    }
}
