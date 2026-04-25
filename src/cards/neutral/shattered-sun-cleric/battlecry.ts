import { BattlecryModel } from "../../../feats/battlecry";
import { Selector } from "../../../utils/controller";
import { RoleModel } from "../../../entities/role";
import { ShatteredSunClericBuffModel } from "./buff";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";
import { useConsoleGroup } from "set-piece";

export class ShatteredSunClericBattlecryModel extends BattlecryModel<RoleModel> {
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
    @useConsoleGroup()
    protected async handleRun(target?: RoleModel): Promise<void> {
        if (!target) return;
        target.entity?.addFeature(new ShatteredSunClericBuffModel());
    }
}
