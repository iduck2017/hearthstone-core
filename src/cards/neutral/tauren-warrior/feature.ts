import { useMemo, useRoute } from "set-piece";
import { FeatureModel } from "../../../features";
import { RoleModel } from "../../../entities/role";
import { BuffOperatorType, RoleAttackDecor, useRoleAttackDecorConsumer } from "../../../decors/role-attack";

const ENRAGE_ATTACK = 3;

export class TaurenWarriorFeatureModel extends FeatureModel {
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

    // Apply +3 attack as an aura buff while the warrior is damaged (enrage).
    // Reactive re-evaluation removes the buff automatically when health is restored.
    @useRoleAttackDecorConsumer()
    protected _onAttackDecor(decor: RoleAttackDecor) {
        const health = this.role?.health;
        if (!health) return;
        if (health.current < health.maximum) {
            decor.addBuff({
                value: ENRAGE_ATTACK,
                type: BuffOperatorType.AURA,
                source: this,
            });
        }
    }
}
