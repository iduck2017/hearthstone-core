import { Event } from "set-piece";

export class AbortEvent<
    T extends Record<string, any> = {}
> extends Event<T & { isAbort: boolean }> {
    constructor(props: T) {
        super({ 
            isAbort: false, 
            ...props,
        });
    }

    public abort() {
        this._detail.isAbort = true;
    }
}