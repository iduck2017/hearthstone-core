import { useMemo, useRoute } from "set-piece";
import { FeatureModel } from "../../../features";
import { RoleModel } from "../../../entities/role";
import { RoleDamageReceivePostEvent, useRoleDamageReceiveEventConsumer } from "../../../event/role-damage-receive";
import { GurubashiBerserkerBuffModel } from "./buff";

export class GurubashiBerserkerFeatureModel extends FeatureModel {
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

    // Each time this minion takes damage, attach a new permanent +3 attack buff.
    @useRoleDamageReceiveEventConsumer()
    private _onReceiveAttack(event: RoleDamageReceivePostEvent, _target: RoleModel) {
        const role = this._role;
        if (!role) return;
        console.log('GurubashiBerserker Receive damage')
        role.addFeature(new GurubashiBerserkerBuffModel());
    }
}
