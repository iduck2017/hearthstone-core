import { useEffect, useMemo, useRoute, useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { MinionModel } from "../../minion";
import { HeroModel } from "../../../heroes";
import {
    BuffOperatorType,
    RoleAttackDecor,
    useRoleAttackDecorConsumer,
} from "../../../decors/role-attack";

const ENRAGE_ATTACK = 5;

@useModel('angry-chicken-feature-model')
export class AngryChickenFeatureModel extends FeatModel {
    protected _brand: symbol = Symbol('angry-chicken-feature-model');
    @useRoute(() => MinionModel)
    private _minion?: MinionModel;
    @useMemo()
    public get role() {
        return this._minion?.role ?? this._hero?.role;
    }


    // Apply +5 attack as an aura buff whenever the chicken is damaged (enrage).
    // The consumer re-evaluates reactively, so reading health.current here
    // registers it as a dependency — the buff is removed automatically when
    // health is restored to maximum.
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
