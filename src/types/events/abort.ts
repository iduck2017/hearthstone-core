import { Event } from "set-piece";

export class AbortEvent<
    T extends Record<string, any> = {}
> extends Event<T & { aborted: boolean }> {
    constructor(props: T) {
        super({ 
            aborted: false, 
            ...props,
        });
    }

    public abort() {
        this.origin.aborted = true;
    }
}