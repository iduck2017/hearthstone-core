import { useChild, useModel } from "set-piece";
import { FeatModel } from ".";
import { SpellDamageDecor, usePlayerSpellDamageDecorConsumer } from "../decors/spell-damage";
import { BuffOperatorType } from "../decors/role-attack";
import { BoardOnlyTagModel } from "../rules/board-only-tag";

/** Reusable Spell Damage aura feat. Active only while the entity is on the board. */
@useModel('spell-damage-feat-model')
export class SpellDamageFeatModel extends FeatModel {
    protected _brand: symbol = Symbol('spell-damage-feat-model');

    private readonly _value: number;

    @useChild()
    private _boardOnly: BoardOnlyTagModel;

    constructor(value: number = 1) {
        super();
        this._value = value;
        this._boardOnly = new BoardOnlyTagModel();
    }

    @usePlayerSpellDamageDecorConsumer()
    protected _onSpellDamageDecor(decor: SpellDamageDecor) {
        decor.addBuff({
            value: this._value,
            type: BuffOperatorType.AURA,
            source: this,
        });
    }
}
