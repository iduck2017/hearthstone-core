import { Model, useEventProducer } from "set-piece";
import { RestoreDealOption, RestoreDealPostEvent, RestoreDealPrevEvent } from "../event/restore-deal";

export class RestoreSourceModel extends Model {
    constructor() {
        super();
        this.init();
    }

    // Restore health to a target role, firing RestoreDeal events around the call.
    // target.receiveRestore handles the actual health restoration.
    @useEventProducer(() => [RestoreDealPrevEvent, RestoreDealPostEvent])
    public restoreHealth(options: RestoreDealOption, _event?: RestoreDealPrevEvent) {
        options.target.receiveRestore({ value: options.value });
    }
}
