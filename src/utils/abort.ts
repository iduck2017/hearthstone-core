export class AbortEvent {
    private _isAbort: boolean;
    public get isAbort() { return this._isAbort; }

    constructor() {
        this._isAbort = false;
    }

    public abort() { this._isAbort = true; }
}