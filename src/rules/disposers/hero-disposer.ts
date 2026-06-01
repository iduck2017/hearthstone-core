import { useMemo, useRoute, useModel } from "set-piece";
import { DisposerModel } from ".";
import { PlayerModel } from "../../entities/player";
import { HeroModel } from "../../heroes";

@useModel('hero-disposer-model')
export class HeroDisposerModel extends DisposerModel {
    protected _brand: symbol = Symbol('hero-disposer-model');

    @useRoute(() => PlayerModel)
    private _player?: PlayerModel;
    @useMemo()
    public get player() {
        return this._player;
    }

    @useRoute(() => HeroModel)
    private _hero?: HeroModel;

    @useMemo()
    public get isActived() {
        const role = this._hero?.role;
        if (!role) return true;
        if (this.isDestroyed) return true;
        if (role.health.current <= 0) return true;
        return false;
    }

    public executeLaunch() {
        if (!this.isActived) return;
        const player = this._player;
        console.log('Game over', player);
    }

    public finishLaunch() {
        const hero = this._hero;
        if (!hero) return;
        const deathrattles = hero.deathrattles;
        deathrattles.forEach(hook => hook.launch());
    }
}
    