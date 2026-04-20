import { useEffect, useMemo, useRoute } from "set-piece";
import { FeatureModel } from "../../../features";
import { RoleModel } from "../../../entities/role";
import {
    BuffOperatorType,
    RoleCurrentAttackDecor,
    useRoleCurrentAttackDecorConsumer,
} from "../../../decors/role-current-attack";
import { RoleAttackModel } from "../../../rules/role-attack";

const ENRAGE_ATTACK = 5;

export class AngryChickenFeatureModel extends FeatureModel {
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


    // Apply +5 attack as an aura buff whenever the chicken is damaged (enrage).
    // The consumer re-evaluates reactively, so reading health.current here
    // registers it as a dependency — the buff is removed automatically when
    // health is restored to maximum.
    @useRoleCurrentAttackDecorConsumer()
    protected _onAttackDecor(decor: RoleCurrentAttackDecor, _target: RoleAttackModel) {
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
