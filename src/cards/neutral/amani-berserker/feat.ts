import { useMemo, useRoute } from "set-piece";
import { FeatModel } from "../../../feats";
import { MinionModel } from "../../minion";
import {
    BuffOperatorType,
    RoleAttackDecor,
    useRoleAttackDecorConsumer,
} from "../../../decors/role-attack";

const ENRAGE_ATTACK = 3;

export class AmaniBerserkerFeatModel extends FeatModel {
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
