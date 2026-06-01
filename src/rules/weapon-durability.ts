import { Decor, Model, useMemo, useState, useModel, useRoute, useDecorProducer, useDecorConsumer, useEffect } from "set-piece";
import { CardModel } from "../cards";
import { disposerResolver, useDisposer } from "../utils/disposer-resolver";
import { BuffOperator, BuffOperatorType } from "../decors/role-attack";
import { FeatIntf } from "../feats";

export class WeaponDurabilityDecor extends Decor<number> {
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

export function useWeaponDurabilityDecorConsumer<F extends FeatIntf>() {
    return function(
        prototype: F,
        key: string,
        descriptor: TypedPropertyDescriptor<(decor: WeaponDurabilityDecor) => void>
    ) {
        useDecorConsumer((that: F) => {
            const player = that.player;
            if (!player) return;
            const weapon = player.hero?.weapon;
            if (!weapon) return;
            if (!that.feat?.isActived) return;
            return [weapon.durability, WeaponDurabilityDecor];
        })(prototype, key, descriptor);
    }
}

@useModel('weapon-durability-model')
export class WeaponDurabilityModel extends Model {
    protected _brand: symbol = Symbol('weapon-durability-model');

    // Route to the parent weapon card to access its disposer
    @useRoute(() => CardModel)
    private _card?: CardModel;

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

    private _prevMaximum?: number;
    @useEffect()
    protected handleMaximumChange() {
        if (this._prevMaximum !== undefined) {
            const offset = this._maximum - this._prevMaximum;
            if (offset === 0) return;
            if (offset > 0) this._current += offset;
            if (offset < 0) this._current = Math.min(this._current, this._maximum);
        }
        this._prevMaximum = this._maximum;
        return;
    }

    @useState()
    @useDecorProducer(() => WeaponDurabilityDecor)
    private _maximum: number;
    @useMemo()
    public get maximum() {
        return this._maximum;
    }

    constructor(props: { current: number }) {
        super();
        this._origin = props.current;
        this._maximum = props.current;
        this._current = props.current;
    }

    /** Consume 1 durability; schedule weapon disposal when depleted. */
    @useDisposer()
    public consume() {
        this._current -= 1;
        const disposer = this._card?.disposer;
        if (!disposer) return;
        disposerResolver.register(disposer);
    }
}
