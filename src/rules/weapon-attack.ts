import { Model, useDecorConsumer, useMemo, useRange, useRoute, useState, useModel } from "set-piece";
import { PlayerModel } from "../entities/player";
import { GameModel } from "../entities/game";
import { HeroModel } from "../heroes";
import { BuffOperatorType, RoleAttackDecor } from "../decors/role-attack";

@useModel('weapon-attack-model')
export class WeaponAttackModel extends Model {
    protected _brand: symbol = Symbol('weapon-attack-model');

    // Resolves only when the weapon is equipped under the hero (not when in hand/deck)
    @useRoute(() => HeroModel)
    private _hero?: HeroModel;

    @useRoute(() => PlayerModel)
    private _player?: PlayerModel;

    @useRoute(() => GameModel)
    private _game?: GameModel;

    @useRange(0, undefined)
    @useState()
    private _origin: number;
    @useMemo()
    public get origin() {
        return this._origin;
    }

    @useState()
    private _current: number;
    @useMemo()
    public get current() {
        return this._current;
    }

    constructor(props: { origin: number }) {
        super();
        this._origin = props.origin;
        this._current = props.origin;
    }

    // _hero is only set when equipped under the hero, so this aura is naturally suppressed while in hand
    @useDecorConsumer((i: WeaponAttackModel) => [i._hero?.role?.attack, RoleAttackDecor])
    protected _buffHeroAttack(decor: RoleAttackDecor) {
        if (this._game?.currentPlayer !== this._player) return;
        decor.addBuff({
            value: this._current,
            type: BuffOperatorType.AURA,
            source: this,
        });
    }
}
