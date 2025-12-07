import { Event } from "set-piece";

export class AbortEvent<
    T extends Record<string, any> = {}
> extends Event<T & { isValid: boolean }> {
    constructor(props: T) {
        super({ 
            isValid: true, 
            ...props,
        });
    }

    public abort() {
        this.origin.isValid = false;
    }
}