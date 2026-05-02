import { useModel } from "set-piece";
import { BattlecryModel, useBattlecryLaunchHook, useBattlecrySelectHook } from "../../../feats/battlecry";
import { Selector } from "../../../utils/controller";
import { RoleModel } from "../../../entities/role";

@useModel('spellbreaker-battlecry-model')
export class SpellbreakerBattlecryModel extends BattlecryModel<RoleModel> {
    protected _brand: symbol = Symbol('spellbreaker-battlecry-model');

    @useBattlecrySelectHook()
    protected handleSelect(): Selector<RoleModel> | undefined {
        const player = this.player;
        if (!player) return;
        const opponent = player.opponent;
        if (!opponent) return;
        const minions = [
            ...player.board.minions,
            ...opponent.board.minions,
        ];
        const options = minions
            .filter(m => m !== this.entity)
            .map(m => m.role);
        return { options };
    }

    @useBattlecryLaunchHook()
    protected async handleRun(target?: RoleModel): Promise<void> {
        if (!target) return;
        target.minion?.silence();
    }
}
