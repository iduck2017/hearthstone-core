import { Model, PostEvent, PrevEvent, useEventConsumer } from "set-piece";
import { RestoreSourceModel } from "../rules/restore-source";
import { RoleModel } from "../entities/role";

export interface RestoreDealOption {
    target: RoleModel;
    value: number;
}

export class RestoreDealPostEvent extends PostEvent<RestoreDealOption, unknown> {
    protected _brand: symbol = Symbol('restore-deal-post-event');
}
export class RestoreDealPrevEvent extends PrevEvent<RestoreDealOption> {
    protected _brand: symbol = Symbol('restore-deal-prev-event');
}


export function useRestoreDealEventConsumer<I extends Model & { restoreSource: RestoreSourceModel | undefined }>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(event: RestoreDealPostEvent) => void>
    ) {
        useEventConsumer((i: I) => [i.restoreSource, RestoreDealPostEvent])(
            prototype,
            key,
            descriptor
        );
    }
}

export function useRestoreDealPrevEventConsumer<I extends Model & { restoreSource: RestoreSourceModel | undefined }>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(event: RestoreDealPrevEvent) => void>
    ) {
        useEventConsumer((i: I) => [i.restoreSource, RestoreDealPrevEvent])(
            prototype,
            key,
            descriptor
        );
    }
}
