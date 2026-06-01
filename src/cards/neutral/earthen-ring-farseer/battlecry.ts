import { useModel } from "set-piece";
import { BattlecryModel } from "../../../feats/battlecry";
import { Selector } from "../../../utils/controller";
import { RoleModel } from "../../../entities/role";
import { useBattlecryLaunchHook } from "../../../feats/battlecry";
import { useBattlecrySelectHook } from "../../../feats/battlecry";

@useModel('earthen-ring-farseer-battlecry-model')
export class EarthenRingFarseerBattlecryModel extends BattlecryModel<RoleModel> {
    protected _brand: symbol = Symbol('earthen-ring-farseer-battlecry-model');

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
        this.entity?.restoreSource.launch({ target, value: 3 });
    }
}
