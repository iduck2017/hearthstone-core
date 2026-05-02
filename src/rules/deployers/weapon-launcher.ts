import { useAction, useModel, useRoute } from "set-piece";
import { LauncherModel } from ".";
import { PlayerModel } from "../../entities/player";
import { WeaponModel } from "../../cards/weapon";
import { CardDeployerModel } from "./card-launcher";

@useModel('weapon-launcher')
export class WeaponLauncherModel extends CardDeployerModel {
    protected _brand: symbol = Symbol('weapon-launcher')

    @useRoute(() => WeaponModel)
    protected _weapon?: WeaponModel

    @useAction()
    public equip() {
        const player = this._player;
        if (!player) return;
        const weapon = this._weapon;
        if (!weapon) return;
        player.workspace.removeCard(weapon);
        player.hero.equipWeapon(weapon);
    }

    public async launch() {
        if (!this.isPlayable) return;
        const player = this._player;
        if (!player) return;
        const weapon = this._weapon;
        if (!weapon) return;
        weapon.consumeMana();
        weapon.prepare(player);
        this.equip();
    }
}
