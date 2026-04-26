import { useChild, useMemo, useRoute, useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { RoleModel } from "../../../entities/role";
import { BoardModel } from "../../../entities/board";
import { TurnEndPostEvent, useTurnEndEventConsumer } from "../../../event/turn-end";
import { RoleAttackBuffModel } from "../../../feats/role-attack-buff";

@useModel('dark-iron-dwarf-buff-model')
export class DarkIronDwarfBuffModel extends FeatModel {
    protected _brand: symbol = Symbol('dark-iron-dwarf-buff-model');
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
        
    }

    @useTurnEndEventConsumer()
    private _handleTurnEnd(event: TurnEndPostEvent) {
        this.deactive();
    }
}
