export class Selector<T = any> {
    public readonly candidates: Readonly<T[]>;

    private readonly handler: (target: T) => unknown;

    constructor(
        candidates: T[],
        handler: (target: T) => unknown
    ) {
        this.candidates = candidates;
        this.handler = handler;
    }

    public use() {
        Selector._stack.push(this);
        return this;
    }

    public run(target: T) {
        this.handler(target);
        Selector._stack.pop();
    }

    
    private static _stack: Selector[] = [];
    public static get stack(): Readonly<Selector[]> {
        return [...this._stack];
    }
}