import { Model, PostEvent, PrevEvent, useEventConsumer } from "set-piece";
import { RoleModel } from "../entities/role";

export interface RoleDamageReceiveOption {
    value: number;
}

export class RoleDamageReceivePostEvent extends PostEvent<RoleDamageReceiveOption, unknown> {
    protected _brand: symbol = Symbol('role-damage-receive-post-event');
}
export class RoleDamageReceivePrevEvent extends PrevEvent<RoleDamageReceiveOption> {
    protected _brand: symbol = Symbol('role-damage-receive-prev-event');
}


export function useRoleDamageReceivePrevEventConsumer<I extends Model & { role: RoleModel | undefined }>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(event: RoleDamageReceivePrevEvent) => void>
    ) {
        useEventConsumer((i: I) => [i.role, RoleDamageReceivePrevEvent])(
            prototype,
            key,
            descriptor
        );
    }
}

export function useRoleDamageReceiveEventConsumer<I extends Model & { role: RoleModel | undefined }>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(event: RoleDamageReceivePostEvent) => void>
    ) {
        useEventConsumer((i: I) => [i.role, RoleDamageReceivePostEvent])(
            prototype,
            key,
            descriptor
        );
    }
}
