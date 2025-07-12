import { DebugUtil, Model } from "set-piece";

export class Selector<T extends Model = Model> {

    private static _isLock: boolean = false;
    public static get isLock() { return this._isLock; }

    private static _current?: Selector;
    public static get current() { return this._current; }

    public readonly candidates: Readonly<T[]>;

    public readonly desc: string;

    private resolve?: (target: T | undefined) => unknown;

    constructor(
        candidates: T[],
        desc: string,
    ) {
        this.candidates = candidates;
        this.desc = desc;
    }

    @DebugUtil.log()
    public set(target: T) { this.resolve?.(target); }

    @DebugUtil.log()
    public cancel() { this.resolve?.(undefined); }

    public async get(): Promise<T | undefined> {
        if (Selector._isLock) return;
        Selector._isLock = true;
        Selector._current = this;
        const result = await new Promise<T | undefined>((resolve, reject) => {
            this.resolve = resolve;
        })
        delete this.resolve;
        delete Selector._current;
        Selector._isLock = false;
        return result;
    }
}