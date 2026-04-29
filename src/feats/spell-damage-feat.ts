import { useModel } from "set-piece";
import { FeatModel } from ".";
import { SpellDamageDecor, usePlayerSpellDamageDecorConsumer } from "../decors/spell-damage";
import { BuffOperatorType } from "../decors/role-attack";
import { BoardOnlyControllerModel } from "./board-only-controller";

/** Reusable Spell Damage aura feat. Active only while the entity is on the board. */
@useModel('spell-damage-feat-model')
export class SpellDamageFeatModel extends FeatModel {
    protected _brand: symbol = Symbol('spell-damage-feat-model');

    private readonly _value: number;

    constructor(value: number = 1) {
        super({ subFeats: [new BoardOnlyControllerModel()] });
        this._value = value;
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
