import { useChild, useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { RoleAttackBuffModel } from "../../../feats/role-attack-buff";
import { TurnEndPostEvent, useTurnEndEventConsumer } from "../../../event/turn-end";

// Temporary +2 Attack buff granted each time a spell is cast. Expires at turn end.
@useModel('mana-addict-buff-model')
export class ManaAddictBuffModel extends FeatModel {
    protected _brand: symbol = Symbol('mana-addict-buff-model');

    @useChild()
    public attackBuff: RoleAttackBuffModel;

    constructor() {
        super();
        this.attackBuff = new RoleAttackBuffModel(2);
    }

    @useTurnEndEventConsumer()
    private _handleTurnEnd(_event: TurnEndPostEvent) {
        this.deactive();
    }
}
