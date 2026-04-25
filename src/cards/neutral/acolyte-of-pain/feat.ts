import { useMemo, useRoute } from "set-piece";
import { FeatModel } from "../../../feats";
import { MinionModel } from "../../minion";
import { RoleDamageReceivePostEvent, useRoleDamageReceiveEventConsumer } from "../../../event/role-damage-receive";

export class AcolyteOfPainFeatModel extends FeatModel {
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

    // Whenever this minion takes damage, draw a card for its controller.
    @useRoleDamageReceiveEventConsumer()
    private _onDamageReceive(event: RoleDamageReceivePostEvent) {
        this.player?.drawCard();
    }
}
