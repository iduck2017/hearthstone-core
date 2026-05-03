import { useDecorConsumer, useDecorProducer, useRange, useRoute, useState, Model, useMemo, useModel, Decor } from "set-piece";
import { CardModel } from "../cards";
import { PlayerModel } from "../entities/player";
import { BuffOperator, BuffOperatorType } from "../decors/role-attack";
import { FeatIntf } from "../feats";
import { MinionModel } from "../cards/minion";

export class CostDecor extends Decor<number> {
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

// Subscribes to the CostDecor of all minion cards in the player's hand.
// Use this to apply cost reductions to friendly minions in hand (e.g. Pint-Sized Summoner).
export function usePlayerMinionCostDecorConsumer<F extends FeatIntf>() {
    return function(
        prototype: F,
        key: string,
        descriptor: TypedPropertyDescriptor<(decor: CostDecor) => void>
    ) {
        useDecorConsumer((that: F) => {
            const cards = that.player?.cards ?? [];
            const minions = cards.filter(card => card instanceof MinionModel);
            const targets = minions.map(card => card.cost);
            if (!that.feat?.isActived) return [undefined, CostDecor];
            return [targets, CostDecor];
        })(prototype, key, descriptor);
    }
}

@useModel('cost-model')
export class CostModel extends Model {
    protected _brand: symbol = Symbol('cost-model');
    constructor(props?: {
        origin?: number;
    }) {
        super();
        this._origin = props?.origin ?? 1;
        this._current = this._origin;
    }

    @useState()
    private _origin: number;
    @useMemo()
    public get origin() { return this._origin; }

    @useDecorProducer(() => CostDecor)
    @useRange(0, undefined)
    @useState()
    private _current: number;
    @useMemo()
    public get current() { return this._current }

    @useRoute(() => PlayerModel)
    private _player?: PlayerModel;

    public consume() {
        if (!this._player) return;
        this._player.mana.consume(this._current);
    }
}
