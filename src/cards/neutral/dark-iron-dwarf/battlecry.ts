import { useModel } from "set-piece";
import { BattlecryModel } from "../../../feats/battlecry";
import { Selector } from "../../../utils/controller";
import { RoleModel } from "../../../entities/role";
import { DarkIronDwarfBuffModel } from "./buff";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";
import { useBattlecrySelectHook } from "../../../hooks/battlecry-selector";

@useModel('dark-iron-dwarf-battlecry-model')
export class DarkIronDwarfBattlecryModel extends BattlecryModel<RoleModel> {
    protected _brand: symbol = Symbol('dark-iron-dwarf-battlecry-model');

    @useBattlecrySelectHook()
    protected handleSelect(): Selector<RoleModel> | undefined {
        const player = this.player;
        if (!player) return;
        const options = player.board.minions.map(minion => minion.role);
        return { options };
    }

    @useBattlecryRunHook()
    protected async handleRun(target?: RoleModel): Promise<void> {
        if (!target) return;
        target.entity?.addFeat(new DarkIronDwarfBuffModel());
    }
}
