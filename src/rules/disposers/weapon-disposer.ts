import { useMemo, useRoute, useModel } from "set-piece";
import { DisposerModel } from ".";
import { PlayerModel } from "../../entities/player";
import { CardModel } from "../../cards";
import { WeaponDurabilityModel } from "../weapon-durability";

@useModel('weapon-disposer-model')
export class WeaponDisposerModel extends DisposerModel {
    protected _brand: symbol = Symbol('weapon-disposer-model');

    // Held by reference (not @useChild) — WeaponDurabilityModel is already a child of WeaponModel
    private readonly _durability: WeaponDurabilityModel;

    constructor(durability: WeaponDurabilityModel) {
        super();
        this._durability = durability;
    }

    @useRoute(() => PlayerModel)
    private _player?: PlayerModel;

    // Routes to the nearest CardModel ancestor, which is the WeaponModel
    @useRoute(() => CardModel)
    private _card?: CardModel;

    public get isActived() {
        if (this.isDestroyed) return true;
        if (this._durability.current <= 0) return true;
        return false;
    }

    public run() {
        if (!this.isActived) return;
        const player = this._player;
        const card = this._card;
        if (!player || !card) return;
        // Remove from player's weapon slot, then send to graveyard
        player.unequipWeapon();
        player.graveyard.disposeCard(card);
    }

    public finishRun() {
        // Weapons have no deathrattle
    }
}
