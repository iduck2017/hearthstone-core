export class Selector<T = any> {
    private _options: T[];
    public get options(): Readonly<T[]> { 
        return [...this._options];
    }

    public hint?: string;
    public desc?: string;

    constructor(
        options: T[],
        config?: {
            hint?: string;
            desc?: string;
        }
    ) {
        this._options = options;
        this.hint = config?.hint;
        this.desc = config?.desc;
    }

    public exclude(handler: (item: T) => boolean) {
        this._options = this._options.filter(handler);
        return this;
    }
}
