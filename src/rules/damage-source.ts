import { Model, useEventProducer, useModel } from "set-piece";
import { DamageDealOption, DamageDealPostEvent, DamageDealPrevEvent } from "../event/damage-deal";

@useModel('damage-source-model')
export class DamageSourceModel extends Model {
    protected _brand: symbol = Symbol('damage-source-model');

    // Deal damage to a target role, firing DamageDeal events around the call.
    // target.receiveDamage handles divine shield and fires RoleDamageReceive events.
    @useEventProducer(() => [DamageDealPrevEvent, DamageDealPostEvent])
    public dealDamage(options: DamageDealOption, _event?: DamageDealPrevEvent) {
        options.target.receiveDamage({ value: options.value });
    }
}
