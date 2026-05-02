import { useModel } from "set-piece";
import { BattlecryModel } from "../../../feats/battlecry";
import { Selector } from "../../../utils/controller";
import { RoleModel } from "../../../entities/role";
import { useBattlecrySelectHook } from "../../../feats/battlecry";
import { useBattlecryLaunchHook } from "../../../feats/battlecry";

@useModel('voodoo-doctor-battlecry-model')
export class VoodooDoctorBattlecryModel extends BattlecryModel<RoleModel> {
    protected _brand: symbol = Symbol('voodoo-doctor-battlecry-model');

    @useBattlecrySelectHook()
    protected handleSelect(): Selector<RoleModel> | undefined {
        const player = this.player;
        const opponent = player?.opponent;
        if (!player || !opponent) return;
        const options = [
            ...player.board.minions, player.hero,
            ...opponent.board.minions, opponent.hero,
        ].map(item => item.role);
        return { options };
    }

    @useBattlecryLaunchHook()
    private async handleRun(target?: RoleModel): Promise<void> {
        if (!target) return;
        this.entity?.restoreSource.launch({ target, value: 2 });
    }
}
