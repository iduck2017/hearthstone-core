export class Selector<T = any> {
    private _options: T[];
    public get options(): Readonly<T[]> { 
        return [...this._options];
    }

    public hint?: string;
    public desc?: string;
    
    private handlers: Array<(item?: any) => void>;

    constructor(
        options: T[],
        config?: {
            hint?: string;
            desc?: string;
            then?: (item?: T) => void;
        }
    ) {
        this._options = options;
        this.hint = config?.hint;
        this.desc = config?.desc;
        this.handlers = config?.then ? [config.then] : [];
    }

    public exclude(handler: (item: T) => boolean) {
        this._options = this._options.filter(handler);
        return this;
    }
    
    public then(handler: (item?: T) => void) {
        this.handlers.push(handler);
        return this;
    }

    public resolve(item: T) {
        this.handlers.forEach(handler => handler(item));
        this.handlers = [];
    }
}
