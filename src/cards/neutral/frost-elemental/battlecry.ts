import { useModel } from "set-piece";
import { BattlecryModel, useBattlecryLaunchHook, useBattlecrySelectHook } from "../../../feats/battlecry";
import { Selector } from "../../../utils/controller";
import { RoleModel } from "../../../entities/role";

@useModel('frost-elemental-battlecry-model')
export class FrostElementalBattlecryModel extends BattlecryModel<RoleModel> {
    protected _brand: symbol = Symbol('frost-elemental-battlecry-model');

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
        return { options };
    }

    @useBattlecryLaunchHook()
    protected async handleRun(target?: RoleModel): Promise<void> {
        if (!target) return;
        target.freeze.active();
    }
}
