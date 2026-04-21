import { useMemo, useRoute } from "set-piece";
import { FeatureModel } from "../../../features";
import { RoleModel } from "../../../entities/role";
import {
    BuffOperatorType,
    RoleAttackDecor,
    useRoleAttackDecorConsumer,
} from "../../../decors/role-attack";
import { RoleAttackModel } from "../../../rules/role-attack";

const ENRAGE_ATTACK = 3;

export class AmaniBerserkerFeatureModel extends FeatureModel {
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

    @useRoleAttackDecorConsumer()
    protected _onAttackDecor(decor: RoleAttackDecor, _target: RoleAttackModel) {
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
