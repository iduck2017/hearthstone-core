import { useMemo, useRoute } from "set-piece";
import { FeatureModel } from "../../../features";
import { RoleModel } from "../../../entities/role";
import { RoleDamageReceivePostEvent, useRoleDamageReceiveEventConsumer } from "../../../event/role-damage-receive";

export class AcolyteOfPainFeatureModel extends FeatureModel {
    @useRoute(() => RoleModel)
    private _role?: RoleModel;
    @useMemo()
    public get role() {
        return this._role;
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
