import { Event, Model, PrevEvent, useEventConsumer, useModel } from "set-piece";
import { RoleModel } from "../../entities/role";

export interface DamageDealOption {
    target: RoleModel;
    value: number;
}

export class DamageDealEvent extends Event {
    protected _brand: symbol = Symbol('damage-deal-post-event');
}
export class DamageDealPrevEvent extends PrevEvent<DamageDealOption> {
    protected _brand: symbol = Symbol('damage-deal-prev-event');
}

@useModel('damage-source-model')
export class DamageSourceModel extends Model {
    protected _brand: symbol = Symbol('damage-source-model');

    // Deal damage to a target role, firing DamageDeal events around the call.
    // target.receiveDamage handles divine shield and fires RoleDamageReceive events.
    public launch(options: DamageDealOption) {
        const prevEvent = new DamageDealPrevEvent(options);
        this.emitEvent(prevEvent);
        if (prevEvent.isAborted) return;
        options.target.health.receiveDamage({
            value: options.value,
            source: this.parent,
        });
        const postEvent = new DamageDealEvent()
        this.emitAsyncEvent(postEvent)
    }
}

export function useDamageDealEventConsumer<I extends Model & { damageSource: DamageSourceModel | undefined }>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(event: DamageDealEvent) => void>
    ) {
        useEventConsumer((self: I) => {
            const damageSource = self.damageSource;
            if (!damageSource) return;
            return [damageSource, DamageDealEvent]
        })(prototype, key, descriptor)
    }
}

export function useDamageDealPrevEventConsumer<I extends Model & { damageSource: DamageSourceModel | undefined }>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(event: DamageDealPrevEvent) => void>
    ) {
        useEventConsumer((self: I) => {
            const damageSource = self.damageSource;
            if (!damageSource) return;
            return [damageSource, DamageDealPrevEvent]
        })(prototype, key, descriptor)
    }
}
