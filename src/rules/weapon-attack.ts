import { Decor, Model, useDecorConsumer, useDecorProducer, useMemo, useRange, useRoute, useState, useModel } from "set-piece";
import { PlayerModel } from "../entities/player";
import { GameModel } from "../entities/game";
import { HeroModel } from "../heroes";
import { BuffOperatorType, RoleAttackDecor, BuffOperator } from "../decors/role-attack";
import { FeatIntf } from "../feats";

export class WeaponAttackDecor extends Decor<number> {
    private _operators: BuffOperator[] = [];

    public addBuff(buff: BuffOperator) {
        this._operators.push(buff);
    }

    public get result() {
        let origin = this.origin;
        this._operators.sort((opA, opB) => {
            if (opA.type === BuffOperatorType.AURA) return 1;
            return opA.source.uuid.localeCompare(opB.source.uuid);
        });
        this._operators.forEach(op => {
            switch (op.type) {
                case BuffOperatorType.COMMON:
                case BuffOperatorType.AURA:
                    origin += op.value;
                    break;
                case BuffOperatorType.RESET:
                    origin = op.value;
                    break;
                default: break;
            }
        });
        return Math.max(0, origin);
    }
}

export function useWeaponAttackDecorConsumer<F extends FeatIntf>() {
    return function(
        prototype: F,
        key: string,
        descriptor: TypedPropertyDescriptor<(decor: WeaponAttackDecor) => void>
    ) {
        useDecorConsumer((that: F) => {
            const player = that.player;
            if (!player) return;
            const weapon = player.hero?.weapon;
            if (!weapon) return;
            if (!that.feat?.isActived) return;
            return [weapon.attack, WeaponAttackDecor];
        })(prototype, key, descriptor);
    }
}

@useModel('weapon-attack-model')
export class WeaponAttackModel extends Model {
    protected _brand: symbol = Symbol('weapon-attack-model');

    // Resolves only when the weapon is equipped under the hero (not when in hand/deck)
    @useRoute(() => HeroModel)
    private _hero?: HeroModel;

    @useRoute(() => GameModel)
    private _game?: GameModel;

    @useRoute(() => PlayerModel)
    private _player?: PlayerModel;

    @useRange(0, undefined)
    @useState()
    private _origin: number;
    @useMemo()
    public get origin() {
        return this._origin;
    }

    @useDecorProducer(() => WeaponAttackDecor)
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
        const currentPlayer = this._game?.currentPlayer;
        if (currentPlayer !== this._player) return;
        decor.addBuff({
            value: this._current,
            type: BuffOperatorType.AURA,
            source: this,
        });
    }

}
