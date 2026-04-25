import { Model, PostEvent, PrevEvent, useEventConsumer } from "set-piece";
import { RoleModel } from "../entities/role";

export interface RoleAttackPerformOption {
    target: RoleModel;
}

export class RoleAttackPerformPostEvent extends PostEvent<RoleAttackPerformOption, unknown> {
    protected _brand: symbol = Symbol('role-attack-perform-post-event');
}
export class RoleAttackPerformPrevEvent extends PrevEvent<RoleAttackPerformOption> {
    protected _brand: symbol = Symbol('role-attack-perform-prev-event');
}


export function useRoleAttackPerformPrevEventConsumer<I extends Model & { role: RoleModel | undefined }>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(event: RoleAttackPerformPrevEvent) => void>
    ) {
        useEventConsumer((i: I) => [i.role, RoleAttackPerformPrevEvent])(
            prototype,
            key,
            descriptor
        );
    }
}

export function useRoleAttackPerformEventConsumer<I extends Model & { role: RoleModel | undefined }>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(event: RoleAttackPerformPostEvent) => void>
    ) {
        useEventConsumer((i: I) => [i.role, RoleAttackPerformPostEvent])(
            prototype,
            key,
            descriptor
        );
    }
}
