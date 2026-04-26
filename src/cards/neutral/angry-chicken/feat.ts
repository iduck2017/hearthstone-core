import { useChild, useEffect, useMemo, useRoute, useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { MinionModel } from "../../minion";
import { HeroModel } from "../../../heroes";
import { BoardOnlyTagModel } from "../../../rules/board-only-tag";
import {
    BuffOperatorType,
    RoleAttackDecor,
    useRoleAttackDecorConsumer,
} from "../../../decors/role-attack";

const ENRAGE_ATTACK = 5;

@useModel('angry-chicken-feat-model')
export class AngryChickenFeatModel extends FeatModel {
    protected _brand: symbol = Symbol('angry-chicken-feat-model');
    @useRoute(() => MinionModel)
    private _minion?: MinionModel;
    @useMemo()
    public get role() {
        return this._minion?.role ?? this._hero?.role;
    }

    @useChild()
    private _boardOnly: BoardOnlyTagModel;

    constructor() {
        super();
        this._boardOnly = new BoardOnlyTagModel();
        
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
