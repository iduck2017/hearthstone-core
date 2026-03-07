import { BattlecryModel } from "../../../hooks/battlecry";
import { SquireModel } from "../../derivatives/squire";
import { Model, asRoute } from "set-piece";
import { MinionModel } from "../../../entities/minion";

export class SilverHandKnightBattlecryModel extends BattlecryModel<Model> {
    @asRoute(() => MinionModel)
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
        
        const squire = new SquireModel();
        squire.summon(board, index + 1);
    }
}
