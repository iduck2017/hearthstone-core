import { useMemo, useRoute, useModel } from "set-piece";
import { DisposerModel } from ".";
import { PlayerModel } from "../../entities/player";
import { HeroModel } from "../../heroes";
import { WeaponModel } from "../../cards/weapon";

@useModel('weapon-disposer-model')
export class WeaponDisposerModel extends DisposerModel {
    protected _brand: symbol = Symbol('weapon-disposer-model');

    @useRoute(() => HeroModel)
    private _hero?: HeroModel;

    @useRoute(() => PlayerModel)
    private _player?: PlayerModel;

    @useRoute(() => WeaponModel)
    private _weapon?: WeaponModel;

    public get isActived() {
        if (this.isDestroyed) return true;
        if (!this._weapon) return true;
        if (this._weapon.durability.current <= 0) return true;
        return false;
    }

    public run() {
        if (!this.isActived) return;
        const hero = this._hero;
        const player = this._player;
        const weapon = this._weapon;
        if (!hero || !player || !weapon) return;
        // Remove from hero's weapon slot, then send to graveyard
        hero.unequipWeapon();
        player.graveyard.addCard(weapon);
    }

    public finishRun() {
        // Weapons have no deathrattle
    }
}
