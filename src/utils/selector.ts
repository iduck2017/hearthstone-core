export class Selector<T> {
    public readonly candidates: Readonly<T[]>;

    public readonly set: (target: T) => boolean;

    constructor(
        candidates: T[],
        handler: (target: T) => boolean
    ) {
        this.candidates = candidates;
        this.set = handler;
    }

    public use() {}
}