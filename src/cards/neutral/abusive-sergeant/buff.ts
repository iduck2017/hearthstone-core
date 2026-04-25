import { useMemo, useRoute } from "set-piece";
import { FeatureModel } from "../../../features";
import { RoleModel } from "../../../entities/role";
import { BoardModel } from "../../../entities/board";
import { TurnEndPostEvent, useTurnEndEventConsumer } from "../../../event/turn-end";
import { BuffOperatorType, RoleAttackDecor, useRoleAttackDecorConsumer } from "../../../decors/role-attack";

export class AbusiveSergeantBuffModel extends FeatureModel {
    @useRoute(() => RoleModel)
    private _role?: RoleModel;
    @useMemo()
    public get role() {
        return this._role;
    }

    @useRoute(() => BoardModel)
    private _board?: BoardModel;
    @useMemo()
    public get board() {
        return this._board;
    }

    constructor() {
        super();
        this.init();
    }

    @useRoleAttackDecorConsumer()
    protected _modifyRoleCurrentAttack(decor: RoleAttackDecor) {
        decor.addBuff({
            value: 2,
            type: BuffOperatorType.COMMON,
            source: this,
        });
    }

    @useTurnEndEventConsumer()
    private _handleTurnEnd(event: TurnEndPostEvent) {
        console.log('HandleTurnEnd', this.board);
        this.deactive();
    }
}
