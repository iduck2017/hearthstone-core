import { Decor, Model, useDecorConsumer } from "set-piece";
import { BuffOperator, BuffOperatorType } from "./role-attack";
import { FeatModel } from "../feats";
import { PlayerModel } from "../entities/player";
import { CardModel } from "../cards";

export interface SpellFeatureModel extends Model {
    feat: FeatModel | undefined;
    player?: PlayerModel | undefined;
}

export class SpellDamageDecor extends Decor<number> {
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
        return origin;
    }
}

// Subscribes to the SpellDamageDecor of every SpellEffect in the player's hand.
// Use this to apply spell damage buffs to all friendly spells (e.g. Kobold Geomancer).
export function usePlayerSpellDamageDecorConsumer<I extends SpellFeatureModel>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(decor: SpellDamageDecor) => void>
    ) {
        useDecorConsumer((that: I) => {
            const cards: CardModel[] = that.player?.cards ?? [];
            const feats: FeatModel[] = [];
            cards.forEach(card => feats.push(...card.feats))
            if (!that.feat?.isActived) return;
            return [feats, SpellDamageDecor]
        })(prototype, key, descriptor);
    }
}
