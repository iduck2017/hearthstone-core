import { useMemo, useRoute, useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { MinionModel } from "../../minion";
import { BoardOnlyControllerModel } from "../../../feats/board-only-controller";
import { GurubashiBerserkerBuffModel } from "./buff";
import { useDamageReceiveEventConsumer } from "../../../rules/role-health";
import { RoleDamageReceiveEvent } from "../../../rules/role-health";

@useModel('gurubashi-berserker-feat-model')
export class GurubashiBerserkerFeatModel extends FeatModel {
    protected _brand: symbol = Symbol('gurubashi-berserker-feat-model');
    @useRoute(() => MinionModel)
    private _minion?: MinionModel;
    @useMemo()
    public get role() {
        return this._minion?.role ?? this._hero?.role;
    }

    constructor() {
        super({ subFeats: [new BoardOnlyControllerModel()] });
    }

    // Each time this minion takes damage, attach a new permanent +3 attack buff.
    @useDamageReceiveEventConsumer()
    private _onReceiveAttack(event: RoleDamageReceiveEvent) {
        if (!this._minion) return;
        console.log('GurubashiBerserker Receive damage');
        this._minion.addFeat(new GurubashiBerserkerBuffModel());
    }
}
