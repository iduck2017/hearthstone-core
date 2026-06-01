import { useModel } from "set-piece";
import { BattlecryModel } from "../../../feats/battlecry";
import { Selector } from "../../../utils/controller";
import { RoleModel } from "../../../entities/role";
import { useBattlecryLaunchHook } from "../../../feats/battlecry";
import { useBattlecrySelectHook } from "../../../feats/battlecry";

@useModel('elven-archer-battlecry-model')
export class ElvenArcherBattlecryModel extends BattlecryModel<RoleModel> {
    protected _brand: symbol = Symbol('elven-archer-battlecry-model');

    @useBattlecrySelectHook()
    protected handleSelect(): Selector<RoleModel> | undefined {
        const game = this.game;
        if (!game) return;
        const options = [
            ...game.playerA.board.minions,
            ...game.playerB.board.minions,
            game.playerA.hero,
            game.playerB.hero,
        ].map(item => item.role);
        return { options }
    }

    @useBattlecryLaunchHook()
    private async handleRun(target?: RoleModel): Promise<void> {
        if (!target) return;
        this.entity?.damageSource.launch({ target, value: 1 });
    }
}
