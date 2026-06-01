import { useModel } from "set-piece";
import { BattlecryModel } from "../../../feats/battlecry";
import { Selector } from "../../../utils/controller";
import { MinionModel } from "../../minion";
import { useBattlecryLaunchHook } from "../../../feats/battlecry";
import { useBattlecrySelectHook } from "../../../feats/battlecry";
import { RaceType } from "../../../utils/enums";
import { HungryCrabBuffModel } from "./buff";

@useModel('hungry-crab-battlecry-model')
export class HungryCrabBattlecryModel extends BattlecryModel<MinionModel> {
    protected _brand: symbol = Symbol('hungry-crab-battlecry-model');

    @useBattlecrySelectHook()
    protected handleSelect(): Selector<MinionModel> | undefined {
        const game = this.game;
        if (!game) return;
        const murlocs = [
            ...game.playerA.board.minions,
            ...game.playerB.board.minions,
        ].filter(minion => minion.races.includes(RaceType.MURLOC));

        if (murlocs.length === 0) return;
        return { options: murlocs }
    }

    @useBattlecryLaunchHook()
    private async handleRun(target?: MinionModel): Promise<void> {
        if (!target) return;
        const card = this.entity;
        target.disposer.destroy();
        card?.addFeat(new HungryCrabBuffModel());
    }
}
