import { Model, useEventProducer, useModel } from "set-piece";
import { RestoreDealOption, RestoreDealPostEvent, RestoreDealPrevEvent } from "../event/restore-deal";

@useModel('restore-source-model')
export class RestoreSourceModel extends Model {
    protected _brand: symbol = Symbol('restore-source-model');

    // Restore health to a target role, firing RestoreDeal events around the call.
    // target.receiveRestore handles the actual health restoration.
    @useEventProducer(() => [RestoreDealPrevEvent, RestoreDealPostEvent])
    public restoreHealth(options: RestoreDealOption, _event?: RestoreDealPrevEvent) {
        options.target.receiveRestore({ value: options.value });
    }
}
