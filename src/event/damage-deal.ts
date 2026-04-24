import { Model, PostEvent, PrevEvent, useEventConsumer } from "set-piece";
import { DamageSourceModel } from "../rules/damage-source";
import { RoleModel } from "../entities/role";

export interface DamageDealOption {
    target: RoleModel;
    value: number;
}

export class DamageDealPostEvent extends PostEvent<DamageDealOption, unknown> {
    protected _brand: symbol = Symbol('damage-deal-post-event');
}
export class DamageDealPrevEvent extends PrevEvent<DamageDealOption> {
    protected _brand: symbol = Symbol('damage-deal-prev-event');
}


export function useDamageDealEventConsumer<I extends Model & { damageSource: DamageSourceModel | undefined }>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(event: DamageDealPostEvent, target: DamageSourceModel) => void>
    ) {
        useEventConsumer((i: I) => [i.damageSource, DamageDealPostEvent])(
            prototype,
            key,
            descriptor
        );
    }
}

export function useDamageDealPrevEventConsumer<I extends Model & { damageSource: DamageSourceModel | undefined }>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(event: DamageDealPrevEvent, target: DamageSourceModel) => void>
    ) {
        useEventConsumer((i: I) => [i.damageSource, DamageDealPrevEvent])(
            prototype,
            key,
            descriptor
        );
    }
}
