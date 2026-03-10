import { useDep, useRoute, useMountHook, useUnmountHook, useSelfValidator } from "set-piece";
import { FeatureModel } from "../../../features";
import { RoleModel } from "../../../entities/role";
import { NumberDecorModel, NumberDecorType } from "../../../utils/number-decor";
import { MinionModel } from "../../../entities/minion";
import { HeroModel } from "../../../entities/hero";
import { useRoleAttackBuff } from "../../../utils/use-role-attack-buff";
import { TurnEndEvent, useTurnEndEventListener } from "../../../utils/turn-event";
import { GameModel } from "../../../entities/game";
import { BoardModel } from "../../../entities/board";

@useRoleAttackBuff(2)
export class AbusiveSergeantBuffModel extends FeatureModel {
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
