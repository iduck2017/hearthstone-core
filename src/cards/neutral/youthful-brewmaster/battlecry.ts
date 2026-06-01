import { useModel } from "set-piece";
import { BattlecryModel, useBattlecryLaunchHook, useBattlecrySelectHook } from "../../../feats/battlecry";
import { Selector } from "../../../utils/controller";
import { RoleModel } from "../../../entities/role";
import { MinionModel } from "../../minion";

@useModel('youthful-brewmaster-battlecry-model')
export class YouthfulBrewmasterBattlecryModel extends BattlecryModel<RoleModel> {
    protected _brand: symbol = Symbol('youthful-brewmaster-battlecry-model');

    @useBattlecrySelectHook()
    protected handleSelect(): Selector<RoleModel> | undefined {
        const player = this.player;
        if (!player) return;
        const options = player.board.minions
            .filter(m => m !== this.entity)
            .map(m => m.role);
        return { options };
    }

    @useBattlecryLaunchHook()
    protected async handleRun(target?: RoleModel): Promise<void> {
        if (!target) return;
        target.minion?.withdraw()
    }
}
