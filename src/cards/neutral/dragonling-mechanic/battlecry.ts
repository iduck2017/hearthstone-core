import { BattlecryModel } from "../../../feats/battlecry";
import { MechanicalDragonlingModel } from "../../derivatives/mechanical-dragonling";
import { Model, useRoute, useModel } from "set-piece";
import { useBattlecryLaunchHook } from "../../../feats/battlecry";
import { MinionModel } from "../../minion";

@useModel('dragonling-mechanic-battlecry-model')
export class DragonlingMechanicBattlecryModel extends BattlecryModel<Model> {
    protected _brand: symbol = Symbol('dragonling-mechanic-battlecry-model');

@useRoute(() => MinionModel)
    private _minion?: MinionModel;

    @useBattlecryLaunchHook()
    protected async handleRun(): Promise<void> {
        const player = this.player;
        if (!player) return;
        const minion = this._minion;
        if (!minion) return;
        const board = player.board;
        const index = board.cards.indexOf(minion);
        if (index === -1) return;
        const dragonling = new MechanicalDragonlingModel();
        dragonling.deployer.summon(player, index + 1);
    }
}
