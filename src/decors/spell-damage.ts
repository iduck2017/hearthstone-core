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
        this._operators.sort((a, b) => a.source.uuid.localeCompare(b.source.uuid));
        this._operators
            .filter(op => op.type !== BuffOperatorType.AURA)
            .forEach(op => {
                switch (op.type) {
                    case BuffOperatorType.COMMON:
                        origin += op.value;
                        break;
                    case BuffOperatorType.RESET:
                        origin = op.value;
                        break;
                    default:
                        break;
                }
            });
        this._operators
            .filter(op => op.type === BuffOperatorType.AURA)
            .forEach(op => origin += op.value);
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
        useDecorConsumer((i: I) => {
            const cards: CardModel[] = i.player?.cards ?? [];
            const targets: FeatModel[] = [];
            cards.forEach(card => targets.push(...card.feats))
            if (!i.feat?.isActived) return [undefined, SpellDamageDecor];
            return [targets, SpellDamageDecor]
        })(
            prototype,
            key,
            descriptor
        );
    }
}
