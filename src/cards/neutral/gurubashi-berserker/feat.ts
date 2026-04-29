import { useChild, useMemo, useRoute, useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { MinionModel } from "../../minion";
import { HeroModel } from "../../../heroes";
import { BoardOnlyTagModel } from "../../../rules/board-only-tag";
import { RoleDamageReceivePostEvent, useRoleDamageReceiveEventConsumer } from "../../../event/role-damage-receive";
import { GurubashiBerserkerBuffModel } from "./buff";

@useModel('gurubashi-berserker-feat-model')
export class GurubashiBerserkerFeatModel extends FeatModel {
    protected _brand: symbol = Symbol('gurubashi-berserker-feat-model');
    @useRoute(() => MinionModel)
    private _minion?: MinionModel;
    @useMemo()
    public get role() {
        return this._minion?.role ?? this._hero?.role;
    }

    @useChild()
    private _boardOnly: BoardOnlyTagModel;

    constructor() {
        super();
        this._boardOnly = new BoardOnlyTagModel();
        
    }

    // Each time this minion takes damage, attach a new permanent +3 attack buff.
    @useRoleDamageReceiveEventConsumer()
    private _onReceiveAttack(event: RoleDamageReceivePostEvent) {
        if (!this._minion) return;
        console.log('GurubashiBerserker Receive damage');
        this._minion.addFeat(new GurubashiBerserkerBuffModel());
    }
}
