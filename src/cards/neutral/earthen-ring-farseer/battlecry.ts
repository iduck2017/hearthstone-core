import { useModel } from "set-piece";
import { BattlecryModel } from "../../../feats/battlecry";
import { Selector } from "../../../utils/controller";
import { RoleModel } from "../../../entities/role";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";

@useModel('earthen-ring-farseer-battlecry-model')
export class EarthenRingFarseerBattlecryModel extends BattlecryModel<RoleModel> {
    protected _brand: symbol = Symbol('earthen-ring-farseer-battlecry-model');
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
        this.entity?.restoreSource.restoreHealth({ target, value: 3 });
    }
}
