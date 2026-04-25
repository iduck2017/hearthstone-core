import { useMemo, useRoute } from "set-piece";
import { FeatModel } from "../../../feats";
import { MinionModel } from "../../minion";
import { HeroModel } from "../../../heroes";
import { BuffOperatorType, RoleAttackDecor, useRoleAttackDecorConsumer } from "../../../decors/role-attack";

const ENRAGE_ATTACK = 3;

export class TaurenWarriorFeatModel extends FeatModel {
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
