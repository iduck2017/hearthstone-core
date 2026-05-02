import { Event, Model, PrevEvent, useEventConsumer, useModel } from "set-piece";
import { RoleModel } from "../../entities/role";

export interface RestoreDealOption {
    target: RoleModel;
    value: number;
}

export class RestoreDealEvent extends Event {
    protected _brand: symbol = Symbol('restore-deal-event');
}
export class RestoreDealPrevEvent extends PrevEvent<RestoreDealOption> {
    protected _brand: symbol = Symbol('restore-deal-prev-event');
}

@useModel('restore-source-model')
export class RestoreSourceModel extends Model {
    protected _brand: symbol = Symbol('restore-source-model');

    // Restore health to a target role, firing RestoreDeal events around the call.
    // target.receiveRestore handles the actual health restoration.
    public launch(options: RestoreDealOption) {
        const prevEvent = new RestoreDealPrevEvent(options);
        this.emitEvent(prevEvent);
        if (prevEvent.isAborted) return;
        options.target.receiveRestore({ value: options.value });
        const postEvent = new RestoreDealEvent();
        this.emitAsyncEvent(postEvent);
    }
}

export function useRestoreDealEventConsumer<I extends Model & { restoreSource: RestoreSourceModel | undefined }>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(event: RestoreDealEvent) => void>
    ) {
        useEventConsumer
            ((i: I) => [i.restoreSource, RestoreDealEvent])
            (prototype, key, descriptor)
    }
}

export function useRestoreDealPrevEventConsumer<I extends Model & { restoreSource: RestoreSourceModel | undefined }>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(event: RestoreDealPrevEvent) => void>
    ) {
        useEventConsumer
            ((i: I) => [i.restoreSource, RestoreDealPrevEvent])
            (prototype, key, descriptor)
    }
}
