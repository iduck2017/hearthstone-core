import { Model, PostEvent, PrevEvent, useEventConsumer } from "set-piece";
import { RoleModel } from "../entities/role";

export interface RoleAttackReceiveOption {
    source: RoleModel;
}

export class RoleAttackReceivePostEvent extends PostEvent<RoleAttackReceiveOption, unknown> {
    protected _brand: symbol = Symbol('role-attack-receive-post-event');
}
export class RoleAttackReceivePrevEvent extends PrevEvent<RoleAttackReceiveOption> {
    protected _brand: symbol = Symbol('role-attack-receive-prev-event');
}


export function useRoleAttackReceivePrevEventConsumer<I extends Model & { role: RoleModel | undefined }>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(event: RoleAttackReceivePrevEvent, target: RoleModel) => void>
    ) {
        useEventConsumer((i: I) => [i.role, RoleAttackReceivePrevEvent])(
            prototype,
            key,
            descriptor
        );
    }
}

export function useRoleAttackReceiveEventConsumer<I extends Model & { role: RoleModel | undefined }>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(event: RoleAttackReceivePostEvent, target: RoleModel) => void>
    ) {
        useEventConsumer((i: I) => [i.role, RoleAttackReceivePostEvent])(
            prototype,
            key,
            descriptor
        );
    }
}
