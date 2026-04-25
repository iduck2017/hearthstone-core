import { useChild, useMemo, useRoute } from "set-piece";
import { FeatModel } from "../../../feats";
import { RoleModel } from "../../../entities/role";
import { BoardModel } from "../../../entities/board";
import { TurnEndPostEvent, useTurnEndEventConsumer } from "../../../event/turn-end";
import { RoleAttackBuffModel } from "../../../feats/role-attack-buff";

export class AbusiveSergeantBuffModel extends FeatModel {
    @useRoute(() => BoardModel)
    private _board?: BoardModel;
    @useMemo()
    public get board() {
        return this._board;
    }

    @useChild()
    public attackBuff: RoleAttackBuffModel;

    constructor() {
        super();
        this.attackBuff = new RoleAttackBuffModel(2);
        this.init();
    }

    @useTurnEndEventConsumer()
    private _handleTurnEnd(event: TurnEndPostEvent) {
        console.log('HandleTurnEnd', this.board);
        this.deactive();
    }
}
