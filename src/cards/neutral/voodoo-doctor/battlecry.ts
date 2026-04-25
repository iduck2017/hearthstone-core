import { BattlecryModel } from "../../../feats/battlecry";
import { Selector } from "../../../utils/controller";
import { RoleModel } from "../../../entities/role";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";

export class VoodooDoctorBattlecryModel extends BattlecryModel<RoleModel> {
    public getSelector(): Selector<RoleModel> | undefined {
        const player = this.player;
        const opponent = player?.opponent;
        if (!player || !opponent) return;
        const options = [
            ...player.board.minions, player.hero,
            ...opponent.board.minions, opponent.hero,
        ].map(item => item.role);
        return { options };
    }

    @useBattlecryRunHook()
    private async handleRun(target?: RoleModel): Promise<void> {
        if (!target) return;
        this.entity?.restoreSource.restoreHealth({ target, value: 2 });
    }
}
