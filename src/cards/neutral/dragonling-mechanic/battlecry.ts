import { BattlecryModel } from "../../../hooks/battlecry";
import { MechanicalDragonlingModel } from "../../derivatives/mechanical-dragonling";
import { Model, useRoute } from "set-piece";
import { MinionModel } from "../../../entities/minion";

export class DragonlingMechanicBattlecryModel extends BattlecryModel<Model> {
    @useRoute(() => MinionModel)
    private _minion?: MinionModel;
    public get minion() {
        return this._minion;
    }

    public getSelector(params: Array<Model | undefined>): undefined {
        return undefined;
    }

    protected async _run(params: Array<Model | undefined>): Promise<void> {
        const player = this.player;
        if (!player) return;
        
        const minion = this.minion;
        if (!minion) return;
        
        const board = player.board;
        const index = board.cards.indexOf(minion);
        if (index === -1) return;
        
        const dragonling = new MechanicalDragonlingModel();
        dragonling.summon(board, index + 1);
    }
}
