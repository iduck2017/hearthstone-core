import { BattlecryModel } from "../../../feats/battlecry";
import { Selector } from "../../../utils/controller";
import { RoleModel } from "../../../entities/role";
import { AbusiveSergeantBuffModel } from "./buff";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";
import { useConsoleGroup, useModel } from "set-piece";
import { useBattlecrySelectHook } from "../../../hooks/battlecry-selector";

@useModel('abusive-sergeant-battlecry-model')
export class AbusiveSergeantBattlecryModel extends BattlecryModel<RoleModel> {
    protected _brand: symbol = Symbol('abusive-sergeant-battlecry-model');

    @useBattlecrySelectHook()
    protected handleSelect(): Selector<RoleModel> | undefined {
        const player = this.player;
        if (!player) return;
        const minions = player.board.minions;
        const options = minions.map(minion => minion.role);
        return { options };
    }

    @useBattlecryRunHook()
    @useConsoleGroup()
    protected async handleRun(target?: RoleModel): Promise<void> {
        if (!target) return;
        target.entity?.addFeat(new AbusiveSergeantBuffModel());
    }
}
