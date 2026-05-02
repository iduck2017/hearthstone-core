import { useMemo, useRoute, useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { MinionModel } from "../../minion";
import { RoleDamageReceiveEvent, useRoleDamageReceiveEventConsumer } from "../../../entities/role";

@useModel('acolyte-of-pain-feature-model')
export class AcolyteOfPainFeatureModel extends FeatModel {
    protected _brand: symbol = Symbol('acolyte-of-pain-feature-model');
    @useRoute(() => MinionModel)
    private _minion?: MinionModel;
    @useMemo()
    public get role() {
        return this._minion?.role ?? this._hero?.role;
    }


    // Whenever this minion takes damage, draw a card for its controller.
    @useRoleDamageReceiveEventConsumer()
    private _onDamageReceive(event: RoleDamageReceiveEvent) {
        this.player?.drawCard();
    }
}
