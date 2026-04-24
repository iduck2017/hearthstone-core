import { Model, useEventProducer } from "set-piece";
import { DamageDealOption, DamageDealPostEvent, DamageDealPrevEvent } from "../event/damage-deal";

export class DamageSourceModel extends Model {
    constructor() {
        super();
        this.init();
    }

    // Deal damage to a target role, firing DamageDeal events around the call.
    // target.receiveDamage handles divine shield and fires RoleDamageReceive events.
    @useEventProducer(() => [DamageDealPrevEvent, DamageDealPostEvent])
    public dealDamage(options: DamageDealOption, _event?: DamageDealPrevEvent) {
        options.target.receiveDamage({ value: options.value });
    }
}
