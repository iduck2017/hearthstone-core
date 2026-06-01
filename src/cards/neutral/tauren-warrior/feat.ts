import { useMemo, useRoute, useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { MinionModel } from "../../minion";
import { BoardOnlyControllerModel } from "../../../feats/board-only-controller";
import { BuffOperatorType, RoleAttackDecor, useRoleAttackDecorConsumer } from "../../../decors/role-attack";

const ENRAGE_ATTACK = 3;

@useModel('tauren-warrior-feat-model')
export class TaurenWarriorFeatModel extends FeatModel {
    protected _brand: symbol = Symbol('tauren-warrior-feat-model');
    @useRoute(() => MinionModel)
    private _minion?: MinionModel;
    @useMemo()
    public get role() {
        return this._minion?.role ?? this._hero?.role;
    }

    constructor() {
        super({ subFeats: [new BoardOnlyControllerModel()] });
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
