import { useMemo, useRoute } from "set-piece";
import { FeatModel } from "../../../feats";
import { MinionModel } from "../../minion";
import { HeroModel } from "../../../heroes";
import { RoleDamageReceivePostEvent, useRoleDamageReceiveEventConsumer } from "../../../event/role-damage-receive";
import { GurubashiBerserkerBuffModel } from "./buff";

export class GurubashiBerserkerFeatModel extends FeatModel {
    @useRoute(() => MinionModel)
    private _minion?: MinionModel;
    @useMemo()
    public get role() {
        return this._minion?.role ?? this._hero?.role;
    }

    constructor() {
        super();
        this.init();
    }

    // Each time this minion takes damage, attach a new permanent +3 attack buff.
    @useRoleDamageReceiveEventConsumer()
    private _onReceiveAttack(event: RoleDamageReceivePostEvent) {
        if (!this._minion) return;
        console.log('GurubashiBerserker Receive damage');
        this._minion.addFeature(new GurubashiBerserkerBuffModel());
    }
}
