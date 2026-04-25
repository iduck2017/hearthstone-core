import { useMemo, useRoute } from "set-piece";
import { FeatureModel } from "../../../features";
import { RoleModel } from "../../../entities/role";
import { BuffOperatorType, RoleAttackDecor, useRoleAttackDecorConsumer } from "../../../decors/role-attack";

const ENRAGE_ATTACK = 3;

export class GurubashiBerserkerBuffModel extends FeatureModel {
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

    // Add a permanent +3 attack buff each time this buff instance is active.
    @useRoleAttackDecorConsumer()
    protected _modifyRoleCurrentAttack(decor: RoleAttackDecor) {
        console.log('GurubashiBerserker buff')
        decor.addBuff({
            value: ENRAGE_ATTACK,
            type: BuffOperatorType.COMMON,
            source: this,
        });
    }
}
