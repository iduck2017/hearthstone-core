import { useMemo, useRoute, useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { MinionModel } from "../../minion";
import { BuffOperatorType, RoleAttackDecor, useAllyRoleAttackDecorConsumer } from "../../../decors/role-attack";
import { RoleHealthDecor, useAllyRoleHealthDecorConsumer } from "../../../decors/role-health";
import { BoardOnlyControllerModel } from "../../../feats/board-only-controller";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RaceType } from "../../../rules/race";

@useModel('southsea-captain-feat-model')
export class SouthseaCaptainFeatModel extends FeatModel {
    protected _brand: symbol = Symbol('southsea-captain-feat-model');

    @useRoute(() => MinionModel)
    private _minion?: MinionModel;
    @useMemo()
    public get role() {
        return this._minion?.role ?? this._hero?.role;
    }

    constructor() {
        super({ subFeats: [new BoardOnlyControllerModel()] });
    }

    // Grant +1 Attack to every other allied Pirate as a reactive aura.
    @useAllyRoleAttackDecorConsumer()
    protected _onAllyAttackDecor(decor: RoleAttackDecor) {
        if (decor.target === this.role?.attack) return;
        if (!(decor.target instanceof RoleAttackModel)) return;
        if (!decor.target.minion?.races.includes(RaceType.PIRATE)) return;
        decor.addBuff({
            value: 1,
            type: BuffOperatorType.AURA,
            source: this,
        });
    }

    // Grant +1 max Health to every other allied Pirate as a reactive aura.
    @useAllyRoleHealthDecorConsumer()
    protected _onAllyHealthDecor(decor: RoleHealthDecor) {
        if (decor.target === this.role?.health) return;
        const targetMinion = this.player?.board.minions.find(m => m.role?.health === decor.target);
        if (!targetMinion?.races.includes(RaceType.PIRATE)) return;
        decor.addBuff({
            value: 1,
            type: BuffOperatorType.AURA,
            source: this,
        });
    }
}
