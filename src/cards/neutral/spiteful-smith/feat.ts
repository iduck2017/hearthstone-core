import { useMemo, useRoute, useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { MinionModel } from "../../minion";
import { BoardOnlyControllerModel } from "../../../feats/board-only-controller";
import { WeaponAttackDecor, useWeaponAttackDecorConsumer } from "../../../rules/weapon-attack";
import { BuffOperatorType } from "../../../decors/role-attack";

@useModel('spiteful-smith-feat-model')
export class SpitefulSmithFeatModel extends FeatModel {
    protected _brand: symbol = Symbol('spiteful-smith-feat-model');

    @useRoute(() => MinionModel)
    private _minion?: MinionModel;
    @useMemo()
    public get role() {
        return this._minion?.role;
    }

    constructor() {
        super({ subFeats: [new BoardOnlyControllerModel()] });
    }

    // Grant +2 Attack to the player's weapon while this minion is damaged.
    @useWeaponAttackDecorConsumer()
    protected _handleWeaponAttack(decor: WeaponAttackDecor) {
        const health = this.role?.health;
        if (!health) return;
        if (health.current >= health.maximum) return;
        decor.addBuff({
            value: 2,
            type: BuffOperatorType.AURA,
            source: this,
        });
    }
}
