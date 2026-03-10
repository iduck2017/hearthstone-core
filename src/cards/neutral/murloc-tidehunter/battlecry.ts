import { BattlecryModel } from "../../../hooks/battlecry";
import { MurlocScoutModel } from "../../derivatives/murloc-scout";
import { Model, useRoute } from "set-piece";
import { MinionModel } from "../../../entities/minion";

export class MurlocTidehunterBattlecryModel extends BattlecryModel<Model> {
    @useRoute(() => MinionModel)
    private _minion?: MinionModel;
    public get minion() {
        return this._minion;
    }

    public getSelector(params: Array<Model | undefined>): undefined {
        // No target selection needed for summon battlecry
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
        
        // Summon Murloc Scout to the right of the tidehunter
        const scout = new MurlocScoutModel();
        scout.summon(board, index + 1);
    }
}
