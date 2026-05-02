import { useMemo, useRoute, useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { BoardModel } from "../../../entities/board";
import { TurnEndEvent, useTurnEndEventConsumer } from "../../../entities/game";
import { RoleAttackBuffModel } from "../../../feats/role-attack-buff";

@useModel('abusive-sergeant-buff-model')
export class AbusiveSergeantBuffModel extends FeatModel {
    protected _brand: symbol = Symbol('abusive-sergeant-buff-model');
    @useRoute(() => BoardModel)
    private _board?: BoardModel;
    @useMemo()
    public get board() {
        return this._board;
    }

    constructor() {
        super({ subFeats: [new RoleAttackBuffModel(2)] });
    }

    @useTurnEndEventConsumer()
    private _handleTurnEnd(event: TurnEndEvent) {
        console.log('HandleTurnEnd', this.board);
        this.disable();
    }
}
