import { useMemo, useRoute, useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { MinionModel } from "../../minion";
import { HeroModel } from "../../../heroes";
import { RoleDamageReceiveEvent, useRoleDamageReceiveEventConsumer } from "../../../entities/role";
import { GurubashiBerserkerBuffModel } from "./buff";

@useModel('gurubashi-berserker-feature-model')
export class GurubashiBerserkerFeatureModel extends FeatModel {
    protected _brand: symbol = Symbol('gurubashi-berserker-feature-model');
    @useRoute(() => MinionModel)
    private _minion?: MinionModel;
    @useMemo()
    public get role() {
        return this._minion?.role ?? this._hero?.role;
    }


    // Each time this minion takes damage, attach a new permanent +3 attack buff.
    @useRoleDamageReceiveEventConsumer()
    private _onReceiveAttack(event: RoleDamageReceiveEvent) {
        if (!this._minion) return;
        console.log('GurubashiBerserker Receive damage');
        this._minion.addFeat(new GurubashiBerserkerBuffModel());
    }
}
