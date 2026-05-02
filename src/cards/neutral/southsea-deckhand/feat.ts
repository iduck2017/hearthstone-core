import { useMemo, useRoute, useModel, useDecorConsumer } from "set-piece";
import { FeatModel } from "../../../feats";
import { MinionModel } from "../../minion";
import { BoardOnlyControllerModel } from "../../../feats/board-only-controller";
import { FeatActiveDecor, useFeatActiveDecorConsumer } from "../../../decors/feat-active";

@useModel('southsea-deckhand-feat-model')
export class SouthseaDeckhandFeatModel extends FeatModel {
    protected _brand: symbol = Symbol('southsea-deckhand-feat-model');

    @useRoute(() => MinionModel)
    private _minion?: MinionModel;
    @useMemo()
    public get role() {
        return this._minion?.role ?? this._hero?.role;
    }

    constructor() {
        super({ 
            subFeats: [new BoardOnlyControllerModel()] 
        });
    }

    // Activate Charge as a reactive aura while the controller has a weapon equipped.
    @useDecorConsumer(that => {
        const role = that.role;
        if (!that.isActived) return;
        if (!role) return;
        const charge = role.charge;
        return [charge, FeatActiveDecor]
    })
    protected _onChargeActiveDecor(decor: FeatActiveDecor) {
        const weapon = this.player?.hero.weapon;
        console.log('hasWeapon')
        if (weapon) decor.enable();
    }
}
