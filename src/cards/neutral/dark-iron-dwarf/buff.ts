import { useDep, useRoute, useSelfValidator } from "set-piece";
import { FeatureModel } from "../../../features";
import { useRoleAttackBuff } from "../../../utils/use-role-attack-buff";
import { TurnEndEvent, useTurnEndEventListener } from "../../../utils/turn-event";
import { GameModel } from "../../../entities/game";
import { BoardModel } from "../../../entities/board";

@useRoleAttackBuff(2)
export class DarkIronDwarfBuffModel extends FeatureModel {
    @useDep()
    @useRoute(() => BoardModel)
    private _board?: BoardModel;
    public get board() {
        return this._board;
    }
    
    @useTurnEndEventListener(s => s.game)
    @useSelfValidator(s => s.isActived)
    @useSelfValidator(s => s.board)
    private _handleTurnEnd(target: GameModel, event: TurnEndEvent) {
        console.log('HandleTurnEnd', this.board);
        this.deactive();
    }
}
